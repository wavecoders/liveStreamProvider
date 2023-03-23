import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, take, BehaviorSubject, switchMap, of, forkJoin, tap, startWith, concat, mergeAll, from, concatMap } from 'rxjs';

import { LiveContentData } from '../up-next/models/live-content.model';
import { GenreData } from '../user-profile/models/genre.model';
import { VirtualChannelService } from './virtual-channel.service';
import { UserProfile } from '../user-profile/models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class LiveContentService {

  updatedPrograms = new BehaviorSubject(false)
  updatedPrograms$ = this.updatedPrograms.asObservable()

  liveContent = new BehaviorSubject<LiveContentData[]>([])
  liveContent$ = this.liveContent.asObservable()

  content = new BehaviorSubject<any[]>([])
  content$ = this.content.asObservable()

  genres = new BehaviorSubject<GenreData[]>([])
  genres$ = this.genres.asObservable()

  bkImage = new BehaviorSubject<string>('')
  bkImage$ = this.content.asObservable()

  contentChanged = new BehaviorSubject(false)
  contentChanged$ = this.contentChanged.asObservable()

  isLoading = new BehaviorSubject(false)
  isLoading$ = this.isLoading.asObservable()

  contentFile = 'streaming.json'
  genreFile = 'streaming-genre.json'


  get mainGenre$() {
    return  this.liveContent$?.pipe(
      map(items => {
        return items.map(item => item.genre)
      }),
      map(items => {
        return [...new Set(items)]
      })
      )
  }

  subGenre$ = (category: string) => {
    return  this.liveContent$?.pipe(
      map(items => {
        return items.filter(item => item.genre.toLowerCase() === category.toLowerCase())
      }),
      map(items => {
        const data = items.map(item => item.sub)
        return [...new Set(data)]
      })
      )
  }

  get liveTv$() {
    return  this.liveContent$?.pipe(
      map(items => {
        return items.map(item => item.type)
      })
      )
  }

  getLivePrograms(user?: UserProfile, count = 4) {

    if(!user) return

    let videoContent: any[] = []

    this.liveContent$.pipe(take(1)).subscribe(data => {
      const result_genre = data.filter(item => item.genre.toLowerCase() === user.genre.toLowerCase())
      videoContent = result_genre.filter(item => item.sub.toLowerCase() === user.sub.toLowerCase())
    })

    const URLContent = this.virtualChannelService.getVirtualChannelSlots(user, videoContent)

    from(URLContent)
    .pipe(
      concatMap(request => {
      return request
    })).subscribe(data => {

      console.log('GET SELECTION OF CONTENT', data)
      const newContent = [...this.content.value, data]
      this.updatedPrograms.next(true)
      this.content.next(newContent)

    }, error => {
      console.log('FAILED', error)
    });

    // this.liveContent.next(videoContent)
    this.updatedPrograms.next(true)
  }

  constructor(
    private http: HttpClient,
    private virtualChannelService: VirtualChannelService,
  ) { }

  initGenres() {

    this.getJSON(this.contentFile).subscribe(data => {
      const content = data.map((data: any) => LiveContentData.adapt(data))
      this.liveContent.next(content)
    })

    this.getJSON(this.genreFile).subscribe(data => {
      const content = data.map((content: any) => GenreData.adapt(content))
      this.genres.next(content)
    })

  }

  private getJSON(file: string): Observable<any> {
    return this.http.get(`assets/streaming-data/${file}`).pipe(take(1))
  }

}
