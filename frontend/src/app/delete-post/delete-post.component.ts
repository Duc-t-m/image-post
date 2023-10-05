import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'delete-post',
  templateUrl: './delete-post.component.html'
})
export class DeletePostComponent {
  @Output() closeModal = new EventEmitter();
  @Output() removePost = new EventEmitter();
}
