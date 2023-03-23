import { Inject, Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpSettings } from '../models/http-request-data.model';
import { Router } from '@angular/router';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    @Inject('http-config') private config: HttpSettings,
    private router: Router,
    ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      catchError((err: HttpErrorResponse) => {

        if (err.status === 401 || err.status === 403 ) {
          this.router.navigate([this.config.redirect_unauthothized])
        }

        const error = (err && err.error && err.error.message) || err.statusText

        return throwError(err)

      })

    )}

}
