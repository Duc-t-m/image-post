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
  post: PostDTO = {} as PostDTO;
  files: File[] = [];
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

  onSelect(addedFiles: File[]) {
    this.files.push(...addedFiles);
  }

  onRemove(index: number) {
    this.files.splice(index, 1);
  }

  //a function to handle the submit event of the form
  //use imageService.saveToLocal to save the images to local storage
  //use postService.addPost to add the post to the database
  //use imageService.saveToDatabase to save the images to the database
  //then emit the reloadPosts event
  onSubmit() {
    this.imageService.saveToLocal(this.files)
      .subscribe(imageNames => {
        this.postService.addPost(this.post)
          .subscribe((post) => {
            this.post.images = imageNames.map(imageName => {
              return { path: imageName, post } as ImageDTO;
            });
            this.imageService.saveToDatabase(this.post.images)
              .subscribe(() => {
                this.reloadPosts.emit();
              })
          })
      })
  }
}
