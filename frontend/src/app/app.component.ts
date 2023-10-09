import { Component } from '@angular/core';
import { PostService } from '../service/post.service';
import { PostDTO } from "../model/post.type"
import { Pagination } from 'src/model/pagination.type';
import { catchError, of, retry } from 'rxjs';
@Component({
  selector: 'root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = "imagesPostFrontend";
  posts: PostDTO[] = [];
  showAdd = false;
  usingCam = false;
  pagination = {
    page: 0,
    size: 3
  } as Pagination
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts(this.pagination.page, this.pagination.size)
      .pipe(
        catchError(error => {
          return of({
            content: [],
            totalPages: 1,
            totalElements: 0,
            numberOfElements: 0
          })
        }),
        retry({ count: 3, delay: 60 * 1000, })
      )
      .subscribe((data: any) => {
        this.posts = data.content;
        this.pagination = {
          ...this.pagination,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          numberOfElements: data.numberOfElements
        }
      });

  }

  toggleModal() {
    this.showAdd = !this.showAdd;
  }

  reloadPosts() {
    this.loadPosts();
    this.toggleModal();
  }

  remove(id: number) {
    this.postService.deletePost(id)
      .subscribe(data => {
        this.loadPosts();
      });
  }

  toggleCam() {
    this.usingCam = !this.usingCam;
  }

  changePage(newPage: number) {
    this.pagination.page = newPage;
    this.loadPosts();
  }
}
