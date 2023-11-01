import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getFromLocal(image: string): Observable<any> {
    return this.http.get(`assets/images/${image}`, { responseType: 'blob' });
  }

  updateImages(postId: number, imagesToAdd: File[], imagesToRemove: string[]): Observable<any> {
    const formData = new FormData();
    formData.append('postId', postId.toString());
    imagesToAdd.forEach(image => formData.append('imagesToAdd', image));
    imagesToRemove.forEach(image => formData.append('imagesToRemove', image));
    
    return this.http.post(`${this.apiUrl}/images`, formData);
  }
}
