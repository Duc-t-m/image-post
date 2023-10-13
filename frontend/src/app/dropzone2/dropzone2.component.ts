import { Component, forwardRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'dropzone2',
  templateUrl: './dropzone2.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => Dropzone2Component)
    }
  ]
})
export class Dropzone2Component implements ControlValueAccessor {
  // Define the properties and methods required by the ControlValueAccessor interface
  disabled: boolean = false;
  touched: boolean = false;
  onChange: (files: File[]) => void = () => { };
  onTouched: () => void = () => { };
  // Define the rest of the component properties and methods
  files: File[] = [];
  imagesDataUrl: string[] = [];
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;
  editing: boolean = false;
  @Output() imagesAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() imageRemoved: EventEmitter<number> = new EventEmitter<number>();

  writeValue(files: File[]): void {
    // Set the value of the dropzone component
    this.files = files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.generateDataUrl(files[i]);
      }
      this.editing = files.length > 0;
      if (this.editing)
        this.markAsTouched();
    }
  }

  registerOnChange(fn: (files: File[]) => void): void {
    // Register the callback function to be called when the value of the dropzone component changes
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    // Register the callback function to be called when the dropzone component is touched
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    // Set the disabled state of the dropzone component
    this.disabled = disabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

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
      let newFiles = [] as File[];
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/'))
          continue;
        this.generateDataUrl(files[i]);
        this.files.push(files[i]);
        if (this.editing)
          newFiles.push(files[i]);
      }
      this.markAsTouched();
      this.onChange(this.files);
      if (this.editing)
        this.imagesAdded.emit(newFiles);
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
    this.fileInput.nativeElement.value = '';
  }

  //a function to remove image from the dropzone and emit the index of the removed image
  removeImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    this.imagesDataUrl.splice(index, 1);
    this.files.splice(index, 1);
    this.onChange(this.files);
    if (this.editing)
      this.imageRemoved.emit(index);
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
  get noImages() {
    return this.imagesDataUrl.length == 0;
  }
}
