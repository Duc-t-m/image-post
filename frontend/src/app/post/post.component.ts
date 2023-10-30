import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileInputValidators } from '@ngx-dropzone/cdk';
import { ViewPostDTO } from 'src/model/post.type';
import { ImageService } from 'src/service/image.service';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'post',
  templateUrl: './post.component.html'
})
export class PostComponent {
  post: ViewPostDTO = {} as ViewPostDTO;
  postForm = {} as FormGroup;
  @Input()
  set _post(post: ViewPostDTO) {
    this.post = post;
    this.postForm = this.formBuilder.group({
      content: [this.post.content, [Validators.required, Validators.maxLength(500)]],
      files: [this.images, [Validators.required, FileInputValidators.maxSize(this.maxFilesSize), Validators.maxLength(this.maxFilesLength)]]
    });
  };
  maxFilesLength = 50;
  maxFilesSize = this.maxFilesLength * 1024 * 1024 * 5; // ~5MB per file
  get contentInput() { return this.postForm.get('content'); }
  get filesInput() { return this.postForm.get('files'); }
  editing: boolean = false;
  deleting: boolean = false;
  @ViewChild("newContentInput")
  set contentRef(ref: ElementRef) {
    if (!!ref)
      ref.nativeElement.focus();
  }
  @Output() removePost: EventEmitter<number> = new EventEmitter();
  showButton = false;
  showImagePreview = false;
  imageToPreviewIndex = -1;

  constructor(
    private postService: PostService,
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) { }

  //a function use imageService.getFromLocal to get the images from local storage
  //then return the images
  get images() {
    let files = [] as File[];
    for (let i = 0; i < this.post.images.length; i++) {
      this.imageService.getFromLocal(this.post.images[i])
        .subscribe(file => {
          files.push(new File([file], this.post.images[i]));
        });
    }
    return files;
  }

  getImagesToDisplay() {
    if (this.post.images.length <= 11)
      return this.post.images;
    return this.post.images.slice(0, 10);
  }

  toggleEditing() {
    if (this.editing) {
      this.postService.updatePost(this.post.id, this.postForm.value)
        .subscribe(() => { this.post.content = this.contentInput?.value });
    }
    this.editing = !this.editing
  }

  toggleDeleting() {
    this.deleting = !this.deleting;
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key == "Enter" && this.postForm.valid) {
      this.toggleEditing();
    }
  }

  //save all newFiles with imageService.saveToLocal
  //then save to database with imageService.saveToDatabase
  //then push all new images to post.images
  addImages(newFiles: File[]) {
    // this.imageService.saveToLocal(newFiles)
    //   .subscribe((imageNames: string[]) => {
    //     let imagesToSave = imageNames.map((imageName: string) => {
    //       return {
    //         path: imageName,
    //         post: this.post.id
    //       } as ImageDTO
    //     });
    //     this.imageService.saveToDatabase(imagesToSave)
    //       .subscribe(() => {
    //         this.post.images = [
    //           ...this.post.images,
    //           ...imagesToSave
    //         ]
    //       });
      // });
  }

  //remove the image from post.images with the index given
  //also delete the image with imageService.deleteImage
  removeImage(index: number) {
    // console.log("removed");
    // let imageToDelete = this.post.images[index];
    // this.post.images = [
    //   ...this.post.images.slice(0, index),
    //   ...this.post.images.slice(index + 1)
    // ];
    // this.imageService.deleteImage(imageToDelete.path)
    //   .subscribe();
  }

  toggleShowButton() {
    this.showButton = true;
  }

  hideButton() {
    this.showButton = false;
  }

  startImagePreview(imageToPreviewIndex: number) {
    this.imageToPreviewIndex = imageToPreviewIndex;
    this.toggleShowImagePreview();
  }

  toggleShowImagePreview() {
    this.showImagePreview = !this.showImagePreview;
  }
}
