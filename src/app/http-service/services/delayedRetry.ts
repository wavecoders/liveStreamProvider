import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, retryWhen} from 'rxjs/operators';

const DEFAULT_MAX_RETRIES = 5;

export function delayedRetry(delayMs: number, maxRetry = DEFAULT_MAX_RETRIES) {

  let retries = maxRetry

  return (src: Observable<any>) =>
    src.pipe(

      retryWhen((errors: Observable<any>) => errors.pipe(
        delay(delayMs),
        mergeMap(error => {
          if (retries <= 0) throwError(error)
          return (retries-- > 0) ? of(error) : throwError(error)
        }
        ))
      )

    )
}
