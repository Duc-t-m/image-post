import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {
  @Input() images!: string[];
  @Input() imageToPreviewIndex!: number;
  @Output() closeImage = new EventEmitter();

  handleClose() {
    this.closeImage.emit();
  }
  
  changeImage(to: string) {
    if (to == "next") {
      this.imageToPreviewIndex++;
      if (this.imageToPreviewIndex == this.images.length)
        this.imageToPreviewIndex = 0;
    }
    if (to == "prev") {
      this.imageToPreviewIndex--;
      if (this.imageToPreviewIndex == -1)
        this.imageToPreviewIndex = this.images.length - 1;
    }
  }
}
