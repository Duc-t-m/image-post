import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { WebcamComponent } from './webcam/webcam-test.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PostLoadingComponent } from './post-loading/post-loading.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from 'src/service/jwt.interceptor';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    AddPostComponent,
    DeletePostComponent,
    WebcamComponent,
    PaginationComponent,
    ImagePreviewComponent,
    PostLoadingComponent,
    DropzoneComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
