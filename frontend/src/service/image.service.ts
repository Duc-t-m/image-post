import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getFromLocal(image: string): Observable<any> {
    return this.http.get(`assets/images/${image}`, { responseType: 'blob' })
      .pipe(
        map((file: Blob) => new File([file], image))
      );
  }
}
