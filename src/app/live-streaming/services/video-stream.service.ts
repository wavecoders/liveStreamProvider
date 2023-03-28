import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/enviroment';

import { map, Observable, throwError, forkJoin, BehaviorSubject, switchMap } from 'rxjs';
import { catchError, concatMap, first, shareReplay, tap } from 'rxjs/operators';

import { UserInfo } from '../models/user-info.model';
import { StreamingSourcesData } from '../models/streaming-sources.model';
import { ContentAssetData } from '../models/content-assets.model';
import { UserChannelStreamData } from '../models/user-channel-stream.model';
import { UserChannelData } from '../models/user-channel.model';
import { UserVirtualChannel } from '../models/user-virtual-channel.model';
import { ProgramSlot } from '../models/program-slot.model';
import { ProgramSlotData } from '../models/program-slot-data.model';

@Injectable({
  providedIn: 'root'
})
export class VideoStreamService {

  private baseUrl = 'https://api.broadpeak.io/v1'

  private get headers() {

    let headers = new HttpHeaders()

    headers = headers.set('Content-Type', 'application/json')
    headers = headers.set('Authorization', `Bearer ${environment.liveApiKey}`)

    return headers

  }

  private userStreams = new BehaviorSubject<UserChannelStreamData[]>([])
  userStreams$ = this.userStreams.asObservable()




  //GETS STREAMING ASSETS AVAILABLE
  streamingSources$ = this.getStreamingSources()

  //GETS STREAMS AVAILABLE - DOCUMENTARY, REALITY (LIVE)
  streamingChannels$ = this.streamingLiveChannels$()

  //GETS STREAMING ASSETS - IMAGES, INFO
  assets$ = this.getJSON('streaming-assets.json').pipe(
    map((data: ContentAssetData[]) => data.map(item => ContentAssetData.adapt(item)))
  )

  //GETS STREAMING ASSET
  getAsset$ = (id: number) => {
    return this.assets$.pipe(
      map(data => data.find(item => item.id === id))
    )
  }

  constructor(
    private _http: HttpClient
  ) { }

  //GETS STREAMS AVAILABLE - SUB-GENRE STREAMS
  streamingContent$ = () => {
    return this.streamingSources$.pipe(
      map(data => {
        return data.filter(item => item.type !== 'live')
      })
    )
  }

  //GETS USERS SLOTS AVAILABLE - NOT > CUR
  liveProgramSlots$ = (user: UserInfo) => this.getUserProgramSlots(user).pipe(
    map(slots => slots.filter(item => {
      const now = new Date().getTime() / 1000
      const slotEndTime = new Date(item.endTime).getTime() / 1000
      return (slotEndTime > now)
    }))
  )

  //DELETES USERS CHANNEL
  deleteUserStream(user: UserInfo) {

    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/18736
    const URL = `${this.baseUrl}/services/virtual-channel/${user.id}`
    return this._http.delete(URL, { headers: this.headers }).pipe(
      map(() => user),
      switchMap(() => this.getUserStreams()),
      first(),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  //DELETES USER ALL SLOTS
  deleteAllUserStreams() {

    return this.userStreams$.pipe(
      concatMap(users => {
        const userStreams = users.map(user => UserInfo.adapt(user));
        const deleteObservables = userStreams.map(userStream => this.deleteUserStream(userStream));
        return forkJoin(deleteObservables);
      }),
      first(),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  //FUNCTIONS

  //GETS ALL VIRTUAL CHANNELS - USERS
  getUserStreams(limit = 10) {

    // {{API_SCHEME}}://{{API_ROOT}}/services?offset=&limit=10
    const URL = `${this.baseUrl}/services?limit=${limit}`
    return this._http.get<UserChannelStreamData[]>(URL, { headers: this.headers})
    .pipe(
      map(data => {
        return data.map(item => UserChannelStreamData.adapt(item))
      }),
      tap((data) => this.userStreams.next(data)),
      first(),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  //CREATES A USER CHANNEL - GENRE
  createUserStream(user: UserInfo, genre: string) {

      // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel
      const URL = `${this.baseUrl}/services/virtual-channel`

      const liveStreamUrl = 'https://storage.googleapis.com/flm-gcp-lab-live/live/ch1-blmbrg/main.m3u8'
      const liveStreamId = 34270
      const livestreamName = 'Documentary'

      const liveStream = {
        name: user.name,
        baseLive: {
          name: livestreamName,
          url: liveStreamUrl,
          id: liveStreamId
        }
      }

      const channelData = UserVirtualChannel.adapt(liveStream)

      return this._http.post<UserChannelData[]>(URL, channelData,{ headers: this.headers })
      .pipe(
        map(data => UserChannelData.adapt(data)),
        switchMap(() => this.getUserStreams()),
        first(),
        catchError(error => {
          return this.error(error)
        })
      )

    // return this._http.post<UserChannelData[]>(URL, channelData,{ headers: this.headers })
    // .pipe(
    //   map(data => UserChannelData.adapt(data)),
    //   catchError(error => {
    //     return this.error(error)
    //   })
    // )

  }

  //GETS STREAMS AVAILABLE - DOCUMENTARY, REALITY (LIVE)
  private streamingLiveChannels$() {
    return this.streamingSources$.pipe(
      map(data => {
        return data.filter(item => item.type === 'live')
      })
    )
  }

  private getStreamingSources(limit = 100) {

    // {{API_SCHEME}}://{{API_ROOT}}/sources?offset=&limit=100
    const URL = `${this.baseUrl}/sources?limit=${limit}`
    return this._http.get<StreamingSourcesData[]>(URL, { headers: this.headers })
    .pipe(
      shareReplay(1),
      map(data => data.map(item => StreamingSourcesData.adapt(item))),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  private getUserProgramSlots(user: UserInfo, limit = 100) {

    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/19625/slots?offset=&limit=10
    const URL = `${this.baseUrl}/services/virtual-channel/${user.id}/slots?limit=${limit}`
    return this._http.get<ProgramSlotData[]>(URL, { headers: this.headers }).pipe(
      map((data) => data),
      catchError(error => {
        return this.error(error)
      })
    )
  }

  createUserProgramSlots(user: UserInfo, subGenre: string) {

    const contentSelected = this.assets$.pipe(
      map(data => data.filter(item => item.genre.sub.toLowerCase() === subGenre.toLowerCase()))
    )

    return contentSelected.pipe(
      concatMap(prgs => {

        const duration = 60 * 2 // 2 minutes
        let now = new Date().getTime() / 1000

        const slots = prgs.map(prg => {

          const start = now += duration

          const prgLengthStart = (start) * 1000
          const prgLengthEnd = (start + duration) * 1000

          const startTimeISO = new Date(prgLengthStart).toISOString()
          const endTimeISO = new Date(prgLengthEnd).toISOString()

          const slot = {
            name: prg.name,
            startTime: startTimeISO,
            endTime: endTimeISO,
            duration: duration,
            replacement: { id: prg.id }
          }

          return ProgramSlot.adapt(slot)

        })

        const slotObservables = slots.map(userSlot => this.createUserSlot(user, userSlot))

        return forkJoin(slotObservables)

      }),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  private createUserSlot(user: UserInfo, slot: ProgramSlot) {

    // {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel/18859/slots
    const URL = `${this.baseUrl}/services/virtual-channel/${user.id}/slots`

    return this._http.post<ProgramSlotData>(URL, slot, { headers: this.headers }).pipe(
      map((data) => data),
      catchError(error => {
        return this.error(error)
      })
    )

  }

  private getJSON(file: string): Observable<any> {
    return this._http.get(`assets/streaming-data/${file}`).pipe(shareReplay(1))
  }

  error(err: HttpErrorResponse) {
    console.log('ERROR: ', err.error.message)
    return throwError(err)
  }

}
