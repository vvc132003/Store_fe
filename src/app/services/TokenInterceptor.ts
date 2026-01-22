import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const csrf = this.getCookie('XSRF-TOKEN');

    const secureReq = req.clone({
      withCredentials: true,
      ...(csrf && {
        setHeaders: {
          'X-XSRF-TOKEN': csrf
        }
      })
    });

    return next.handle(secureReq).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          // this.router.navigate(['/dang-nhap']);
        }
        return throwError(() => err);
      })
    );
  }

  private getCookie(name: string): string {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] ?? '';
  }
}
