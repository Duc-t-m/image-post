import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {
  @Input() imageName!: string;
  @Input() onFirst!: boolean;
  @Input() onLast!: boolean;
  @Output() closeImage = new EventEmitter();
  @Output() nextImage = new EventEmitter();
  @Output() prevImage = new EventEmitter();

  handleClose() {
    this.closeImage.emit();
  }
}
