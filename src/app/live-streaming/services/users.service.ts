import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { BehaviorSubject, catchError, first, map, tap, throwError, switchMap, take, toArray } from 'rxjs';

import { GlobalDataStorageService } from '../../services/global-data-storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  storeName = 'quickplay'
  storeSetting = 'users'

  private users = new BehaviorSubject<UserProfile[]>([])
  users$ = this.users.asObservable()

  private get headers() {

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${environment.liveApiKey}`,
    }

   return headers

  }

  constructor(
    private _http: HttpClient,
    private globalDataStorageService: GlobalDataStorageService,
  ) {
    this.initUsers()
  }

  initUsers() {

    this.globalDataStorageService.initDataStore(this.storeName)

    const users = this.globalDataStorageService.getSetting(this.storeName, this.storeSetting)

    if(!users) {
      this.globalDataStorageService.createSetting(this.storeName, this.storeSetting, [], { create: true })
      const users = this.globalDataStorageService.getSetting(this.storeName, this.storeSetting)
      this.users.next(users.value)
    } else {
      this.users.next(users.value)
    }

  }

  createUser() {

    return this.randomUser()
      .pipe(
        tap((data: UserProfile) => {
          const newUsers = [...this.users.getValue(), data]
          this.users.next(newUsers)
          this.globalDataStorageService.updateSetting(this.storeName, this.storeSetting, newUsers)
        }),
      )

  }

  deleteUser(user: UserProfile) {

    return this.users$.pipe(
      map(data => data.filter(item => item.user_id === user.user_id)),
      tap((data: UserProfile[]) => {
        debugger
        // this.users.next(newUsers)
        // this.globalDataStorageService.updateSetting(this.storeName, this.storeSetting, newUsers)
      })
    )

  }

  // updateUser(user?: UserProfile) {

  //   if(user) {
  //     const foundIndex = this.allUsers.findIndex(item => item.user_id === user.user_id)
  //     if(foundIndex >= 0) this.allUsers[foundIndex] = { ...this.allUsers[foundIndex], ...user}
  //   }

  //   this.globalDataStorageService.updateSetting('quickplay','users', this.allUsers)
  //   this.users.next(this.allUsers)
  // }

  clearUsers() {
    this.globalDataStorageService.updateSetting(this.storeName, this.storeSetting, [])
    this.users.next([])
  }

  private randomUser() {

    const URL = environment.user_api
    return this._http.get<any>(URL, { headers: this.headers})
    .pipe(
      map((res: any) => res.results[0]),
      map(data => UserProfile.adapt(data)),
      first(),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  error(err: HttpErrorResponse) {
    console.log('ERROR: ', err.error.message)
    return throwError(err)
  }

}
