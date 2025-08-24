import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  private shouldSkipAlert: boolean = false;

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.shouldSkipAlert = request.headers.get('Skip-Alert') === 'true';

    const token = localStorage.getItem('phToken');
    const authReq = token
      ? request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
      : request;

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const response = event.body;

          if (response?.status === false && response?.errorMessage) {
            if (!this.shouldSkipAlert) {
              this.showAlert(response.errorMessage, 'error');
            }
          } else if (response?.status === true && request.method !== 'GET') {
            if (!this.shouldSkipAlert) {
              this.showAlert('Operation successful', 'success');
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.logErrorForDevelopers(error);

        const errorMessage = error?.error?.errorMessage;

        if (error.status === 0) {
          this.showAlert('The server is currently unavailable. <br> Please try again later.', 'error');
        } else if (error.status === 400) {
          if (!this.shouldSkipAlert) {
            if (errorMessage) {
              this.showAlert(errorMessage, 'error');
            } else {
              const validationErrors = this.formatValidationErrors(error?.error?.errors);
              this.showAlert(validationErrors, 'error');
            }
          }
        } else if (error.status === 500) {
          this.showAlert(errorMessage || 'A server error occurred. Please try again later.', 'error');
        } else {
          if (!this.shouldSkipAlert) {
            this.showAlert(errorMessage || 'An unexpected error occurred.', 'error');
          }
        }

        return throwError(error);
      })
    );
  }

  private showAlert(message: string, icon: 'success' | 'error') {
    const textColor = icon === 'error' ? 'red' : '#000';
    Swal.fire({
      html: `<span style="color: ${textColor}; font-weight: 600; font-size: 19px;">${message}</span>`,
      icon,
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      showCancelButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster',
      },
    });
  }

  private formatValidationErrors(errors: any): string {
    let validationErrors = `
    <span style="font-size: 17px; font-weight: 500; color: red;">
      One or more validation errors occurred:
    </span>
    <ul style="font-size: 15px; font-weight: 500; color: #000; margin-top: 8px; text-align: left;">`;

    if (typeof errors === 'string') {
      const cleanedError = errors.replace(/LineNumber: \d+.*BytePositionInLine: \d+/g, '').trim();
      validationErrors += `<li>• ${cleanedError}</li>`;
    } else if (typeof errors === 'object') {
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errors[key].forEach((errorMessage: string) => {
            validationErrors += `<li>${errorMessage}</li>`;
          });
        }
      }
    } else {
      validationErrors += `<li>• An unknown error occurred.</li>`;
    }

    validationErrors += '</ul>';
    return validationErrors;
  }

  private logErrorForDevelopers(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error('Server-side error:', {
        status: error.status,
        message: error.message,
        details: error.error,
      });
    }
  }
}
