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
    return this.http.get(`${this.apiUrl}/posts`, { params: { page, size, sort: "id,desc" } });
  }

  addPost(post: NewPostDTO): Observable<string> {
    const formData = new FormData();
    formData.append('content', post.content);
    post.images.forEach(image => formData.append('images', image));
    return this.http.post<string>(`${this.apiUrl}/posts`, formData, { responseType: 'text' as 'json' });
  }

  updatePost(id: number, content: string, images: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    images.forEach(image => formData.append('images', image));
    return this.http.put(`${this.apiUrl}/posts/${id}`, formData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }
}