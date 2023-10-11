import { Component, EventEmitter, Output, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'dropzone',
  templateUrl: './dropzone.component.html'
})
export class DropzoneComponent {
  //an input property to accept the images data url
  @Input()
  imagesDataUrl: string[] = [];
  //an output event to emit the files added to the dropzone
  @Output()
  addedFiles = new EventEmitter<File[]>();
  //an output event to emit the index of file removed from the dropzone
  @Output()
  removedFile = new EventEmitter<number>();

  @ViewChild("fileInput")
  fileInputRef: ElementRef = {} as ElementRef;

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  //a function accepting click event on dropzone div and triggering click event on file input
  openFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  //a function accept an event, check if the event is a drag event or input change event
  //then take the files from the event and add them to imagesDataUrl and images
  //then emit the added files
  handleFiles(event: DragEvent | Event) {
    let files: FileList | undefined | null = {} as FileList;
    if (event instanceof DragEvent) {
      event.preventDefault();
      files = event.dataTransfer?.files;
    } else {
      files = (event.target as HTMLInputElement).files;
    }
    if (files) {
      let newFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          this.generateDataUrl(files[i]);
          newFiles.push(files[i]);
        }
      }
      this.addedFiles.emit(newFiles);
    }
  }

  //a function to remove image from the dropzone and emit the index of the removed image
  removeImage(event: MouseEvent, index: number, local?: string) {
    event.stopPropagation();
    this.imagesDataUrl.splice(index, 1);
    this.removedFile.emit(index);
  }

  //a function to generate the image data url from the image file
  generateDataUrl(image: File) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.imagesDataUrl.push(fileReader.result as string);
    };
    fileReader.readAsDataURL(image);
  }

  //a function check if imagesDataUrl is empty
  //if so, return true, otherwise return false
  noImages() {
    return this.imagesDataUrl.length == 0;
  }
}
