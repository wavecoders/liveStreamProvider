import { Observable } from "rxjs"
import { HttpHeaders } from '@angular/common/http';

export interface CrudOperations<T> {

  save(params: [], t: T, headers?: HttpHeaders): Observable<T>
  update(params: [], t: T, headers?: HttpHeaders): Observable<T>
  findOne(params: [], headers?: HttpHeaders): Observable<T>
  findAll(params: [], headers?: HttpHeaders): Observable<T[]>
  delete(params: [], headers?: HttpHeaders): Observable<any>

}
