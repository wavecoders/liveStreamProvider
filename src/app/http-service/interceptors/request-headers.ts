import { Inject, Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { HttpSettings } from '../models/http-request-data.model';

@Injectable()
export class RequestHeadersInterceptor implements HttpInterceptor {

  constructor(
    @Inject('http-config') private config: HttpSettings
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const basicHeaders = {
      'content-type': 'text/plain; */*',
      'Accept': 'application/json'
    }

    // NOTE:
    // if allow-origin is * - you cannot have credentails = true
    // default content-type - text/plain, */*

    const httpOptions = (this.config.includeCookies) ?
      { headers: new HttpHeaders(basicHeaders), withCredentials: true }:
      { headers: new HttpHeaders(basicHeaders) }

    const cloneReq = request.clone(httpOptions)

    return next.handle(cloneReq)
  }
}
