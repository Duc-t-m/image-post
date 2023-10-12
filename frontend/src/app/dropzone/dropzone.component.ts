import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'dropzone',
  templateUrl: './dropzone.component.html'
})
export class DropzoneComponent {
  _imagesDataUrl: string[] = [];
  editing: boolean = false;
  //an input property to accept the images data url
  @Input()
  set imagesDataUrl(_imagesDataUrl: string[]) {
    this._imagesDataUrl = _imagesDataUrl;
    this.editing = true;
  };
  //an output event to emit the files added to the dropzone
  @Output()
  addedFiles = new EventEmitter<File[]>();
  //an output event to emit the index of file removed from the dropzone
  @Output()
  removedFile = new EventEmitter<number>();

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  //a function to handle the files added to the dropzone
  handleNewFiles(files: FileList | null | undefined) {
    if (files) {
      let newFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/'))
          continue;
        if (!this.editing)
          this.generateDataUrl(files[i]);
        newFiles.push(files[i]);
      }
      this.addedFiles.emit(newFiles);
    }
  }

  //a function to handle the files dropped on the dropzone
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    let files = event.dataTransfer?.files;
    this.handleNewFiles(files);

  }

  //a function to handle the files selected from the file input
  onFileInputChange(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    this.handleNewFiles(files);
  }

  //a function to remove image from the dropzone and emit the index of the removed image
  removeImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    if (!this.editing)
      this._imagesDataUrl.splice(index, 1);
    this.removedFile.emit(index);
  }

  //a function to generate the image data url from the image file
  generateDataUrl(image: File) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this._imagesDataUrl.push(fileReader.result as string);
    };
    fileReader.readAsDataURL(image);
  }

  //a function check if imagesDataUrl is empty
  //if so, return true, otherwise return false
  noImages() {
    return this._imagesDataUrl.length == 0;
  }
}
