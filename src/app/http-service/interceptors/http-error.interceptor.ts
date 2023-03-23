import { Inject, Injectable } from "@angular/core";

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { delayedRetry } from "./delayedRetry";
import { HttpSettings } from "../models/http-request-data.model";
import { ErrorMessageService } from "../services/error-message.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  delayNextRequestBy = this.config.delayNextRequestBy * 1000
  numberOfRetries = this.config.requestRetries - 1

    constructor(
      @Inject('http-config') private config: HttpSettings,
      private errorService: ErrorMessageService,
      ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return next.handle(request)
        .pipe(
          delayedRetry(this.delayNextRequestBy, this.numberOfRetries),
          catchError((error: HttpErrorResponse) => {

            let errorMsg = ''

            if (error instanceof HttpErrorResponse) {
              errorMsg = (error.error.error) ? error.error.error : error.error
            } else {
              errorMsg = `Error: ${error}`
            }

            this.errorService.displayError(errorMsg)

            return throwError(error)

          })
        )
    }

  }
