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
  @Input() post: PostDTO = {} as PostDTO;
  editing: boolean = false;
  deleting: boolean = false;
  files: File[] = [];
  @ViewChild("newContentInput") set contentRef(ref: ElementRef) {
    if (!!ref)
      ref.nativeElement.focus();
  }
  @Output() removePost: EventEmitter<number> = new EventEmitter();
  showButton = false;
  showImagePreview = false;
  imageToPreview = "";
  imageToPreviewIndex = -1;

  constructor(
    private postService: PostService,
    private imageService: ImageService
  ) { }

  toggleEditing() {
    if (this.editing) {
      this.postService.addPost(this.post)
        .subscribe();
      this.files = [];
    } else {
      for (let imageName of this.post.images) {
        this.imageService.getFromLocal(imageName)
          .subscribe(imageBlob => {
            let newFile = new File([imageBlob], imageName);
            this.files.push(newFile);
          });
      }
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

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.imageService.saveToLocal(event.addedFiles)
      .subscribe(imageNames => {
        this.post.images.push(...imageNames);
        this.imageService.saveToDatabase(imageNames.map(
          imageName => {
            return { path: imageName, post: this.post.id } as ImageDTO;
          }
        )).subscribe();
      });
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
    this.post.images.splice(this.post.images.indexOf(event.name), 1);
    this.imageService.deleteImage(event.name)
      .subscribe();
  }

  toggleShowButton() {
    this.showButton = true;
  }

  hideButton() {
    this.showButton = false;
  }

  startImagePreview(imageToPreview: string, imageToPreviewIndex: number) {
    this.imageToPreview = imageToPreview;
    this.imageToPreviewIndex = imageToPreviewIndex;
    this.toggleShowImagePreview();
  }

  toggleShowImagePreview() {
    this.showImagePreview = !this.showImagePreview;
  }

  changeImage(to: string) {
    if (to == "next") {
      this.imageToPreviewIndex++;
      if (this.imageToPreviewIndex == this.post.images.length)
        this.imageToPreviewIndex = 0;
      this.imageToPreview = this.post.images[this.imageToPreviewIndex];
    }
    if (to == "prev") {
      this.imageToPreviewIndex--;
      if (this.imageToPreviewIndex == -1)
        this.imageToPreviewIndex = this.post.images.length - 1;
      this.imageToPreview = this.post.images[this.imageToPreviewIndex];
    }
  }
}
