import { Component, Input } from '@angular/core';
import { DropzoneComponent } from '@ngx-dropzone/cdk';

@Component({
  selector: 'custom-dropzone',
  templateUrl: './custom-dropzone.component.html'
})
export class CustomDropzoneComponent extends DropzoneComponent {
  @Input() inputId = "files";
  @Input() preview = false;
}
