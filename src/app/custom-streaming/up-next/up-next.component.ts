import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, take, tap, BehaviorSubject, switchMap } from 'rxjs';

import { LiveContentData } from './models/live-content.model';
import { UserProfile } from '../user-profile/models/user-profile.model';
import { LiveContentService } from '../services/live-content.service';
import { VirtualChannelService } from '../services/virtual-channel.service';
import { ContentData } from './models/content.model';
import { VideoContentData } from './models/video-content.model';

@Component({
  selector: 'app-up-next',
  templateUrl: './up-next.component.html',
  styleUrls: ['./up-next.component.css']
})
export class UpNextComponent implements OnInit {

  _user = UserProfile.adapt()
  @Input() set user(value: UserProfile) {
    this._user = value
    this.getContent()
  }

  get user(): UserProfile {
    return this._user
  }

  liveContent?: Observable<LiveContentData[]>

  currentTime = new BehaviorSubject<{ date: string, time: string }>({ date: '', time: '' })
  currentTime$ = this.currentTime.asObservable()

  // content: VideoContentData[] = []

  // virtualChannels: ContentData[] = []

  // content = new BehaviorSubject<VideoContentData[]>([])
  // content$ = this.content.asObservable()

  content$ = this.liveContentService.content$

  validContent: ContentData[] = []

  get hasContent() {
    const content = this.liveContentService.content.value.filter(item => !this.contentIsExpired(item.timeEnd))
    return (content.length > 0) ? true : false
  }

  liveContent$ = this.liveContentService.liveContent$

  // selectedContent$ = this.liveContentService.content$

  constructor(
    private liveContentService: LiveContentService,
    private virtualChannelService: VirtualChannelService,
  ) { }

  ngOnInit() {

    this.liveContentService.updatedPrograms$.subscribe(() => {
      this.getContent()
    })

    // setInterval(() => {

    //   const today = new Date().toLocaleTimeString('en', { timeStyle: 'long', hour12: false, timeZone: 'UTC' })
    //   this.currentTime.next({ date: new Date().toISOString(), time: today })

    // }, 1000)

  }

  getCurrentContent() {

    const curTime = Math.floor(new Date().getTime() / 1000)

    const foundContent = this.validContent.find(content => {
      const startTime = (Math.floor(new Date(content!.startTime).getTime() / 1000))
      const endTime = (Math.floor(new Date(content!.endTime).getTime() / 1000))
      return (startTime >= curTime && endTime <= curTime)
    })

    return foundContent

  }

  // getGenreBackground() {

  //   this.content$.subscribe(videoData => {

  //     if(videoData && videoData.length > 0) {
  //       const genre = VideoContentData.adapt(videoData[0]).details.description.split(' ')[0]
  //       const bkImage = '/assets/images/content/genre/' + genre.toLowerCase() + '.jpg'
  //       this.liveContentService.bkImage.next(bkImage)
  //       console.log('VIDEO:',videoData, bkImage)
  //     }

  //   })

  // }

  getContent() {

    this.virtualChannelService.getActiveVirtualChannelSlots(this.user)
      .subscribe((data: ContentData[]) => {

        this.validContent = data.filter(item => {
          const curTime = Math.floor((new Date()).getTime() / 1000)
          const slotTime = Math.floor(new Date(item.endTime).getTime() / 1000)
          return (slotTime > curTime)
        })

        console.log('DATA', this.validContent)

        if(this.validContent.length === 0) {
          this.liveContentService.content.next([])
          return
        }

        let videoContent: any[] = []

        this.liveContent$.subscribe(video => {
          const foundContent = this.validContent.map(slotData => {
            return video.filter(item => item.id === slotData.replacement.id)
          })
          videoContent = foundContent.flat(1)
        })

        const videoData = videoContent.map((item: LiveContentData) => {

          const foundValid = this.validContent.find(asset => asset.replacement.id === item.id)
          const startTime = (Math.floor(new Date(foundValid!.startTime).getTime() / 1000))
          const endTime = (Math.floor(new Date(foundValid!.endTime).getTime() / 1000))

          const rawData = { ...item, ...{ details: { title: item.name , description: item.description }, startTime: startTime, timeEnd: endTime } }

          return VideoContentData.adapt(rawData)

        })

          // if(videoData && videoData.length > 0) {
          //   const genre = VideoContentData.adapt(videoData[0]).details.description.split(' ')[0]
          //   const bkImage = '/assets/images/content/genre/' + genre.toLowerCase() + '.jpg'
          //   this.liveContentService.bkImage.next(bkImage)
          //   console.log('VIDEO:',videoData, bkImage)
          // }

          this.liveContentService.content.next(videoData)
        // })

      })

  }

  updateContent() {

    // if(this.user) {

    //   this.virtualChannelService.getActiveVirtualChannelSlots(this.user)
    //   .pipe(take(1))
    //   .subscribe((data: any) => {
    //     this.virtualChannels = data
    //     console.log('updateContent: DATA', this.virtualChannels)
    //     this.updateSelectedContent()
    //   })

    // }

  }

  updateSelectedContent() {

    // this.content = []
    // // console.log('updateSelectedContent: DATA', this.virtualChannels)

    // this.virtualChannels.map((item: ContentData) => {

    //   const timeDisplay = new Date(item.startTime).getTime() / 1000
    //   const timeEnd = timeDisplay + item.duration

    //   const contentId = item.replacement.id //title and description

    //   this.liveContentService.liveContent$.pipe(
    //     map(items => items.find(item => item.id === contentId))
    //   ).subscribe(data => {

    //     const videoContent = VideoContentData.adapt({
    //       poster: data?.poster,
    //       image: data?.image,
    //       details: { title: data?.name, description: data?.description },
    //       timeStart: item.startTime,
    //       timeEnd: item.endTime,
    //     })

    //     this.content.push(videoContent)

    //   })

    // })

  }

  contentIsExpired(timeEnd: number) {
    const cur = Math.floor(new Date().getTime() / 1000)
    return (timeEnd > cur) ? true : false
  }

  onSelected(liveStream: any) {
    console.log('liveStream',liveStream)
  }

  onClearSlots() {
    if(this.user) {
      this.virtualChannelService.clearAllActiveVirtualChannelSlots(this.user)
    }
  }

  isString(x: string | number) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  timeConvert(date: string) {
    return new Date(date).toLocaleTimeString()
  }

}
