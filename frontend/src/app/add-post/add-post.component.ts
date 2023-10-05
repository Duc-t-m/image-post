import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ImageDTO } from 'src/model/image.type';
import { PostDTO } from 'src/model/post.type';
import { ImageService } from 'src/service/image.service';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html'
})
export class AddPostComponent {
  files: File[] = [];
  formData = {
    id: -1,
    content: '',
    images: this.files
  };
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() reloadPosts = new EventEmitter();

  constructor(
    private postService: PostService,
    private imageService: ImageService
  ) { }

  @ViewChild("content") set contentRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }

  handleClose() {
    this.closeModal.emit();
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSubmit() {
    this.postService.addPost({
      ...this.formData,
      images: this.formData.images.map(image => image.name)
    })
      .subscribe((post) => {
        this.imageService.saveToLocal(this.files)
          .subscribe(imageNames => {
            let saveImages = imageNames.map(name => {
              return { path: name, post: post.id } as ImageDTO;
            })
            this.imageService.saveToDatabase(saveImages)
              .subscribe(data => this.reloadPosts.emit());
          });
      });
  }
}
