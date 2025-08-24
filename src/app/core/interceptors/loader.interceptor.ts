import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Loader } from '../../shared/services/loader';




@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: Loader) {}
  
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const skipLoader = request.headers.get('X-Skip-Loader') === 'true';

  if (!skipLoader && request.method !== 'GET') {
    this.loaderService.showLoader();
  }

  return next.handle(request).pipe(
    tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && !skipLoader && request.method !== 'GET') {
          this.loaderService.hideLoader();
        }
      },
      (error) => {
        if (!skipLoader && request.method !== 'GET') {
          this.loaderService.hideLoader();
        }
        console.error('Error:', error);
      }
    )
  );
}

}