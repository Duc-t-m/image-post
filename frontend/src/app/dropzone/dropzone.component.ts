import { Component, forwardRef, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'dropzone',
  templateUrl: './dropzone.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DropzoneComponent)
    }
  ]
})
export class DropzoneComponent implements ControlValueAccessor {
  disabled: boolean = false;
  touched: boolean = false;
  onChange: (files: File[]) => void = () => { };
  onTouched: () => void = () => { };

  files: File[] = [];
  imagesDataUrl: string[] = [];

  @Input() editing: boolean = false;
  @Output() imagesAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() imageRemoved: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;

  writeValue(files: File[]): void {
    this.files = files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.generateDataUrl(files[i]);
      }
    }
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
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

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    let files = event.dataTransfer?.files;
    this.handleNewFiles(files);
  }

  onFileInputChange(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    this.handleNewFiles(files);
    this.fileInput.nativeElement.value = '';
  }

  removeImage(event: MouseEvent, index: number) {
    event.stopPropagation();
    if (this.editing)
      this.imageRemoved.emit(index);
    this.imagesDataUrl.splice(index, 1);
    this.files.splice(index, 1);
    this.onChange(this.files);
  }

  generateDataUrl(image: File) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.imagesDataUrl.push(fileReader.result as string);
    };
    fileReader.readAsDataURL(image);
  }

  get noImages() {
    return this.imagesDataUrl.length == 0;
  }
}
