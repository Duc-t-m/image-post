import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {
  @Input() imageName!: string;
  @Output() closeImage = new EventEmitter();

  handleClose() {
    this.closeImage.emit();
  }
}
