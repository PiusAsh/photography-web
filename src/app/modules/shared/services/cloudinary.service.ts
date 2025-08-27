// cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'piusash'; // from your settings
  private uploadPreset = 'ash-preset'; // create this in Cloudinary dashboard

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<number | string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      // headers: new HttpHeaders(
      //   { 'Skip-Auth': 'true' },
      // )
    });

    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return Math.round((100 * event.loaded) / (event.total ?? 1));
          case HttpEventType.Response:
            return event.body.secure_url; // final uploaded URL
          default:
            return 0;
        }
      })
    );
  }
}
