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
  files: File[] = [];
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
        this.post.images = [
          ...this.post.images,
          ...imageNames
        ];
        this.imageService.saveToDatabase(imageNames.map(
          imageName => {
            return { path: imageName, post: this.post.id } as ImageDTO;
          }
        )).subscribe();
      });
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
    this.post.images = [
      ...this.post.images.slice(0, this.post.images.indexOf(event.name)),
      ...this.post.images.slice(this.post.images.indexOf(event.name) + 1)
    ];
    this.imageService.deleteImage(event.name)
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
}
