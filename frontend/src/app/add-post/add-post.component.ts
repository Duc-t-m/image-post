import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { FileInputValidators } from '@ngx-dropzone/cdk';
import { NewPostDTO } from 'src/model/post.type';
import { PostService } from 'src/service/post.service';

@Component({
  selector: 'add-post',
  templateUrl: './add-post.component.html'
})
export class AddPostComponent {
  maxFilesLength = 50;
  maxFilesSize = this.maxFilesLength * 1024 * 1024 * 5; // ~5MB per file
  newPostForm = this.formBuilder.group({
    content: ['', [
      Validators.required,
      Validators.maxLength(500)
    ]],
    files: [[], [
      Validators.required,
      FileInputValidators.maxSize(this.maxFilesSize),
      Validators.maxLength(this.maxFilesLength)
    ]],
  });
  get contentInput() { return this.newPostForm.get('content') as AbstractControl; }
  get filesInput() { return this.newPostForm.get('files') as AbstractControl; }
  dataURLs: string[] = [];

  submitClicked: boolean = false;

  @Output() closeModal = new EventEmitter<boolean>();
  @Output() reloadPosts = new EventEmitter();
  @ViewChild('inputNeedClearing') inputNeedClearing: ElementRef = new ElementRef(null);
  @ViewChild("newContentInput") set contentRef(ref: ElementRef) {
    if (!!ref) {
      (ref.nativeElement as HTMLTextAreaElement).focus();
    }
  }

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder
  ) { }

  handleClose() {
    this.closeModal.emit();
  }

  onFilesChange() {
    this.inputNeedClearing.nativeElement.value = '';
  }

  onSubmit() {
    if (!this.submitClicked)
      this.submitClicked = true;
    this.newPostForm.markAllAsTouched();
    if (!this.newPostForm.valid)
      return;
    this.postService.addPost({
      content: this.newPostForm.value.content || '',
      images: this.newPostForm.value.files || []
    } as NewPostDTO)
      .subscribe(() => this.reloadPosts.emit());
  }
}
