import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { WebcamComponent } from './webcam/webcam-test.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PostLoadingComponent } from './post-loading/post-loading.component';
@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    AddPostComponent,
    DeletePostComponent,
    WebcamComponent,
    PaginationComponent,
    ImagePreviewComponent,
    PostLoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDropzoneModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
