import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { BehaviorSubject, map, take, concat, switchMap, tap, mergeMap } from 'rxjs';

import { GlobalDataStorageService } from '../../services/global-data-storage.service';
import { CrudService } from 'src/app/http-service/services/crud.service';
import { UserProfile } from '../user-profile/models/user-profile.model';
import { VirtualChannelService } from './virtual-channel.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends CrudService<UserProfile> {

  allUsers: UserProfile[] = []

  private users: any = new BehaviorSubject([])
  users$ = this.users.asObservable()

  private get attachToken() {

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${environment.liveApiKey}`,
    }

    const requestOptions = {
      headers: new Headers(headers),
    }

   return requestOptions

  }

  constructor(
    private globalDataStorageService: GlobalDataStorageService,
    private virtualChannelService: VirtualChannelService,
  ) {
    super(environment.user_api)
  }

  initUsers() {

    const users = this.globalDataStorageService.getSetting('quickplay','users')
    if(!users) this.globalDataStorageService.createSetting('quickplay','users', [])

    this.allUsers = (users?.value) ? users.value : []
    this.users.next(this.allUsers)

  }

  createUser() {
    this.newUser()
      .pipe(
      ).subscribe(data => {
        this.allUsers.push(data)
        this.globalDataStorageService.updateSetting('quickplay','users', this.allUsers, { create: true })
        this.users.next(this.allUsers)
    })
  }

  deleteUser(data: UserProfile) {
    const allUsers: UserProfile[] = this.globalDataStorageService.getSetting('quickplay', 'users').value
    const updatedUsers = allUsers.filter(item => item.user_id !== data.user_id)
    this.globalDataStorageService.updateSetting('quickplay', 'users', updatedUsers, { create: true })
    if(data.active) this.virtualChannelService.deleteVirtualChannel(data)
    this.allUsers = updatedUsers
    this.users.next(updatedUsers)
  }

  updateUser(user?: UserProfile) {

    if(user) {
      const foundIndex = this.allUsers.findIndex(item => item.user_id === user.user_id)
      if(foundIndex >= 0) this.allUsers[foundIndex] = { ...this.allUsers[foundIndex], ...user}
    }

    this.globalDataStorageService.updateSetting('quickplay','users', this.allUsers)
    this.users.next(this.allUsers)
  }

  clearUsers() {
    this.virtualChannelService.clearAllUsers().subscribe(data => {
      this.allUsers = []
      this.updateUser()
    })
  }

  private newUser() {

    return this.findOne([])
    .pipe(
      map((res: any) => res.results[0]),
      map(data => UserProfile.adapt(data)),
    )
  }

}
