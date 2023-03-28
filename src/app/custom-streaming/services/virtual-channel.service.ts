import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';

import { CrudService } from 'src/app/http-service/services/crud.service';
import { UserProfile } from '../user-profile/models/user-profile.model';
import { HttpHeaders } from '@angular/common/http';
import { map, take, switchMap, concatMap, tap, forkJoin, toArray, skip, Observable, EMPTY } from 'rxjs';
import { ChannelData } from './models/channel.model';
import { LiveContentData } from '../up-next/models/live-content.model';
import { ContentData } from '../up-next/models/content.model';
import { VirtualChannel } from './models/virtual-channel.model';

@Injectable({
  providedIn: 'root'
})
export class VirtualChannelService extends CrudService<ContentData|VirtualChannel|any> {

  private get headers() {

    let headers = new HttpHeaders()

    headers = headers.set('Content-Type', 'application/json')
    headers = headers.set('Authorization', `Bearer ${environment.liveApiKey}`)

    return headers

  }

  constructor() {
    super('https://api.broadpeak.io/v1/services/')
  }

  createVirtualChannel(user: UserProfile) {

    // const stream_id = (user.genre === 'documentary') ? 34270 : 35968 //reality

    const userInfo: VirtualChannel = {
      name: user.name.replace(/ /g,"_"),
      environmentTags: ["Prod"],
      baseLive: { id: user.content.stream_id }
    }

    const virtualChannel = ChannelData.adapt(userInfo)

    return this.save(['virtual-channel'], userInfo, this.headers).pipe(take(1))

  }

  getVirtualChannel(user: UserProfile) {

    const URL = `https://api.broadpeak.io/v1/services/virtual-channel/${user.user_id}`

  }

  getVirtualChannelSlots(user: UserProfile, programs: LiveContentData[]) {

    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/18728/slots
    const today = new Date()
    const content = []
    const duration = 1 //minutes
    const startIn = 1 //minutes

    // console.log('CURRENT: ', currentContent)
    console.log('CONTENT: ', programs)

    for (let i = 0; i < programs.length; i++) {

      today.setMinutes(today.getMinutes() + duration + i)
      const nextTime = today.toISOString()

      const prg = programs[i]

      const data = {
        name: prg.name,
        startTime: nextTime,
        duration: duration,
        replacement: { id: prg.id }
      }

      const req = this.save(['virtual-channel', user.user_id, 'slots'], data, this.headers).pipe(take(1))
      content.push(req)

    }

    return content

  }

  getActiveVirtualChannelSlots(user?: UserProfile): Observable<ContentData[]> {

    if(!user) return EMPTY
    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/18859/slots?offset=&limit=1
    return this.findAll(['virtual-channel', user.user_id, 'slots?limit=10'], this.headers)
    .pipe(
      // switchMap((items: ContentData[]) => {
        // return items.filter(item => this.hasExpired(item))
      // }),
      take(1)
    )
  }

  hasExpired(content: ContentData) {

    const today = Math.floor(new Date().getTime() / 1000)
    const current = new Date(content.endTime).getTime() / 1000

    if(today > current) {
      // console.log('HAS EXPIRED', content)
      // this.deleteVirtualChannelSlots(user, content)
      // .subscribe(data => {
      //   console.log('DELETED', data)
      // })
      return true
    }

    return false

  }

  clearAllActiveVirtualChannelSlots(user: UserProfile) {

    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/{serviceId}/slots/{id}
    const today = Math.floor(new Date().getTime() / 1000)

    // this.getActiveVirtualChannelSlots(user)
    //   .subscribe((data: ContentData[]) => {

    //   data.map(content => {

    //     const current = new Date(content.endTime).getTime() / 1000

    //     if(today < current) {
    //       switchMap((data: ContentData) => this.deleteVirtualChannelSlots(user, data))
    //     }

    //   })

    // })

  }

  deleteVirtualChannelSlots(user: UserProfile, content: ContentData) {
    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/{serviceId}/slots/{id}
    return this.delete(['virtual-channel', user.user_id, 'slots', content.id], this.headers)
  }

  deleteVirtualChannel(user: UserProfile) {
    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/18736
    return this.delete(['virtual-channel', user.user_id], this.headers).pipe(take(1)).subscribe()
  }

  clearAllUsers() {

    // {{API_SCHEME}}://{{API_ROOT}}/services?offset=&limit=10
    const URL = `https://api.broadpeak.io/v1//services`

    const toDelete = this.findAll(['?limit=10'], this.headers).pipe(
      switchMap((data: any) => {
        return data.map((user: ChannelData) => {
          return this.delete(['virtual-channel', user.id], this.headers).pipe(take(1)).subscribe()
        })
      }),
      toArray()
    )

    return forkJoin(toDelete)

  }

}

