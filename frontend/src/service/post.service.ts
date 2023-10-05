import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostDTO, Post } from 'src/model/post.type';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getPosts(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`, { params: { page, size } });
  }

  addPost(post: PostDTO): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  updatePost(post: PostDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/posts`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }
}