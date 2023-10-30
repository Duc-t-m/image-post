import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";
import { FileInputValidators } from '@ngx-dropzone/cdk';
import { NewPostDTO } from 'src/model/post.type';
import { ImageService } from 'src/service/image.service';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html'
})
export class AddPostComponent {
  maxFilesLength = 50;
  maxFilesSize = this.maxFilesLength * 1024 * 1024 * 5; // ~5MB per file
  newPostForm = this.formBuilder.group({
    content: ['', [Validators.required, Validators.maxLength(500)]],
    files: [[], [Validators.required, FileInputValidators.maxSize(this.maxFilesSize), Validators.maxLength(this.maxFilesLength)]],
  });
  get contentInput() { return this.newPostForm.get('content'); }
  get filesInput() { return this.newPostForm.get('files'); }
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() reloadPosts = new EventEmitter();
  submitClicked: boolean = false;

  constructor(
    private postService: PostService,
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) { }

  @ViewChild("newContentInput") set contentRef(ref: ElementRef) {
    if (!!ref) {
      (ref.nativeElement as HTMLTextAreaElement).focus();
    }
  }

  handleClose() {
    this.closeModal.emit();
  }

  //a function receive a control's name
  //loop through all controls of newPostForm
  //mark them as touched, after the control's name is found, break the loop
  markBeforeAsTouched(controlName: string) {
    for (let control in this.newPostForm.controls) {
      if (control == controlName)
        break;
      this.newPostForm.get(control)?.markAsTouched();
    }
  }

  onSubmit() {
    if (!this.submitClicked)
      this.submitClicked = true;
    this.newPostForm.markAllAsTouched();
    if (this.newPostForm.invalid)
      return;
    this.postService.addPost(this.newPostForm.value as NewPostDTO)
      .subscribe(() => this.reloadPosts.emit());
  }
}
