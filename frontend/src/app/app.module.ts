import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { WebcamComponent } from './webcam/webcam-test.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PostLoadingComponent } from './post-loading/post-loading.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { JwtModule } from '@auth0/angular-jwt';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { PendingComponent } from './pending/pending.component';

function tokenGetter() {
  return localStorage.getItem("token");
}

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
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SignUpComponent,
    DropzoneComponent,
    PendingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      extendedTimeOut: 1000,
      maxOpened: 3,
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"]
      }
    }),
    DropzoneCdkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
