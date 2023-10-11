import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImageDTO } from 'src/model/image.type';
import { PostDTO } from 'src/model/post.type';
import { ImageService } from 'src/service/image.service';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'post',
  templateUrl: './post.component.html'
})
export class PostComponent {
  @Input()
  post: PostDTO = {} as PostDTO;
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
    private imageService: ImageService
  ) { }

  getImagesToDisplay() {
    if (this.post.images.length <= 11)
      return this.post.images;
    return this.post.images.slice(0, 10);
  }

  toggleEditing() {
    if (this.editing) {
      this.postService.addPost(this.post)
        .subscribe();
    }
    this.editing = !this.editing
  }

  toggleDeleting() {
    this.deleting = !this.deleting;
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.toggleEditing();
    }
  }

  //returns the all images data url from post.images
  //with prefix assets/images/
  getImagesDataUrl() {
    return this.post.images.map((image: ImageDTO) => `assets/images/${image.path}`);
  }

  //save all newFiles with imageService.saveToLocal
  //then save to database with imageService.saveToDatabase
  //then push all new images to post.images
  addImages(newFiles: File[]) {
    this.imageService.saveToLocal(newFiles)
      .subscribe((imageNames: string[]) => {
        let imagesToSave = imageNames.map((imageName: string) => {
          return {
            path: imageName,
            post: this.post.id
          } as ImageDTO
        });
        this.imageService.saveToDatabase(imagesToSave)
          .subscribe(() => {
            this.post.images = [
              ...this.post.images,
              ...imagesToSave
            ]
          });
      });
  }

  //remove the image from post.images with the index given
  //also delete the image with imageService.deleteImage
  removeImage(index: number) {
    let imageToDelete = this.post.images[index];
    this.post.images.splice(index, 1);
    this.imageService.deleteImage(imageToDelete.path)
      .subscribe();
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

  getAllImagesToPreview() {
    return this.post.images.map((image: ImageDTO) => image.path);
  }
}
