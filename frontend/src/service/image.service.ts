import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageDTO } from 'src/model/image.type';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  saveToLocal(images: File[]): Observable<string[]> {
    let formData = new FormData();
    for (let image of images) {
      formData.append("images", image);
    }
    return this.http.post<string[]>(`${this.apiUrl}/images/local`, formData);
  }

  saveToDatabase(images: ImageDTO[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/images`, images);
  }

  deleteImage(image: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/images/${image}`);
  }

  getFromLocal(image: string): Observable<any> {
    return this.http.get(`assets/images/${image}`, { responseType: 'blob' });
  }
}
