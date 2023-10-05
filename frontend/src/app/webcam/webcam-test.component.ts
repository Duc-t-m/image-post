import { Component, ElementRef, ViewChild, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'webcam-test',
  templateUrl: './webcam-test.component.html'
})
export class WebcamComponent {
  WIDTH = 500;
  HEIGHT = 500;

  @ViewChild("video")
  public video: ElementRef = {} as ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef = {} as ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>(); 

  handleClose(){
    this.closeModal.emit();
  }
  
  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
}
