import { Inject, Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { HttpSettings } from '../models/http-request-data.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    @Inject('http-config') private config: HttpSettings
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

      const token = sessionStorage.getItem(this.config.sessionTokenName)

      if(token) {

        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })

      }
    return next.handle(request)
  }
}
