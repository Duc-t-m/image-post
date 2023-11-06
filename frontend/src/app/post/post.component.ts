import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  maxFilesLength = 50;
  maxFilesSize = this.maxFilesLength * 1024 * 1024 * 5; // ~5MB per file
  editing: boolean = false;
  deleting: boolean = false;
  showButton = false;
  showImagePreview = false;
  imageToPreviewIndex = -1;

  @Input()
  set _post(post: ViewPostDTO) {
    this.post = post;
    this.postForm = this.formBuilder.group({
      content: [this.post.content, [
        Validators.required,
        Validators.maxLength(500)
      ]],
      files: [this.images, [
        Validators.required,
        FileInputValidators.maxSize(this.maxFilesSize),
        Validators.maxLength(this.maxFilesLength)
      ]]
    });
  };
  @Output() removePost: EventEmitter<number> = new EventEmitter();
  @ViewChild("newContentInput")
  set contentRef(ref: ElementRef) {
    if (!!ref)
      ref.nativeElement.focus();
  }
  get contentInput() { return this.postForm.get('content') as AbstractControl; }
  get filesInput() { return this.postForm.get('files') as AbstractControl; }
  get images() {
    let files = [] as File[];
    for (let i = 0; i < this.post.images.length; i++) {
      this.imageService.getFromLocal(this.post.images[i])
        .subscribe((file: File) => {
          files.push(file);
        });
    }
    return files;
  }
  get imagesToDisplay() {
    if (this.post.images.length <= 11)
      return this.post.images;
    return this.post.images.slice(0, 10);
  }

  constructor(
    private postService: PostService,
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) { }

  toggleEditing() {
    if (this.editing) {
      this.postService.updatePost(
        this.post.id,
        this.contentInput.value,
        this.filesInput.value
      )
        .subscribe((images) => {
          this.post.content = this.contentInput.value;
          this.post.images = images;
        });
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
