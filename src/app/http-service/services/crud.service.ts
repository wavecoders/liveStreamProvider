import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';

import { CrudOperations } from './crud-operations.interface';
import { catchError, shareReplay } from 'rxjs/operators'
import { NonNullableFormBuilder } from '@angular/forms';

export abstract class CrudService<T> implements CrudOperations<T> {

  protected _http = inject(HttpClient)

  constructor(
    protected _base: string,
  ) {}

  save(params: (string|number)[] = [], t: T, headers?: HttpHeaders): Observable<T> {

    const api = this.buildAPIPath(params)

    return this._http.post<T>(api, t, { headers }).pipe(
      catchError(this.handleError),
    )

  }

  update(params: (string|number)[] = [], t?: T, headers?: HttpHeaders): Observable<T> {

    const api = this.buildAPIPath(params)

    return this._http.put<T>(api, t, { headers }).pipe(
      catchError(this.handleError),
    )

  }

  findOne(params: (string|number)[] = [], headers?: HttpHeaders): Observable<T> {

    const api = this.buildAPIPath(params)

    return this._http.get<T>(api, { headers }).pipe(
      shareReplay(),
      catchError(this.handleError),
    )

  }

  findAll(params: (string|number)[] = [], headers?: HttpHeaders): Observable<T[]> {

    const api = this.buildAPIPath(params)
    console.log('API:', api)
    return this._http.get<T[]>(api, { headers }).pipe(
      shareReplay(),
      catchError(this.handleError),
    )

  }

  delete(params: (string|number)[] = [], headers?: HttpHeaders): Observable<T> {

    const api = this.buildAPIPath(params)

    return this._http.delete<T>(api, { headers }).pipe(
      catchError(this.handleError),
    )
  }

  private handleError(error: Response) {
    return throwError(error)
  }

  private buildAPIPath(params: any[]|any) {

    const pathObjects = params.filter((path:any) => (!this.isObject(path)))
    const queryObjects = params.filter((path:any) => (this.isObject(path)))

    const query = queryObjects.reduce(((r:any, c:any) => Object.assign(r, c)), {})

    const hasQuery = pathObjects.filter((item: string) => (item).toString().slice(0,1) === '?')
    const pathObjectsFiltered = (hasQuery?.length > 0) ? pathObjects?.slice(0, pathObjects?.length-1) : pathObjects

    let path = this.buildRestPath(pathObjectsFiltered)
    if(path.slice(-1) === '/') path.substring(0, path.length-1)

    path = (hasQuery.length > 0) ? path + hasQuery[0] : path

    return(queryObjects.length > 0) ? path + '?' + this.buildQueryPath(query) : path

  }

  private buildRestPath(params: any[]): string {
    return this.cleanUrlPath(this._base +'/'+ params.join('/'))
  }

  private buildQueryPath(params: any): string {
    return Object.keys(params).map(key => key + ((params[key] !== '') ? '=' : '') + encodeURI(params[key])).join('&')
  }

  private cleanUrlPath(str: string) {
    return str.replace(/([^:]\/)\/+/g, "$1").replace(/\/$/,'')
  }

  private isObject(val: any): boolean {
    return (val === NonNullableFormBuilder) ? false : ( (typeof val === 'function') || (typeof val === 'object') )
  }

}




