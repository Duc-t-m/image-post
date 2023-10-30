import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewPostDTO } from 'src/model/post.type';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getPosts(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`, { params: { page, size } });
  }

  addPost(post: NewPostDTO): Observable<any> {
    return this.http.post<number>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: NewPostDTO): Observable<any> {
    return this.http.put<number>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }
}