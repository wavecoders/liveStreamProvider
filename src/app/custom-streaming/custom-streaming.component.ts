import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UserProfile } from './user-profile/models/user-profile.model';
import { UsersService } from './services/users.service';
import { map, Observable } from 'rxjs';
import { GlobalDataStorageService } from '../services/global-data-storage.service';
import { LiveContentService } from './services/live-content.service';

import { VideoService } from './components/services/video.service';

@Component({
  selector: 'app-custom-streaming',
  templateUrl: './custom-streaming.component.html',
  styleUrls: ['./custom-streaming.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStreamingComponent implements OnInit {

  users$: Observable<UserProfile[]> = this.usersService.users$

  liveTv$ = this.liveContentService.liveTv$
  // genre$ = this.liveContentService.subGenre$('Documentary')

  _isLoggedIn = false
  @Input() set isLoggedIn(value: boolean) {
     this._isLoggedIn = value
  }
  get isLoggedIn() {
    return this._isLoggedIn
  }

  selectedTab = -1
  isPlaying$ = this.videoService.playingState$
  // isLoading$ = this.videoService.loading$

  isLoading$ = this.liveContentService.isLoading$

  bkImage$ = this.liveContentService.bkImage$

  user$ = (index: number) => this.users$.pipe(map(data => data[index]))
  usersLength$ = () => this.users$.pipe(map(data => data.length))
  hasUsers$ = () => this.users$.pipe(map(data => (data.length > 0) ? true : false))

  hasContent$ = this.liveContentService.content$.pipe(map(items => (items.length > 0) ? true : false))
  content$ = this.liveContentService.content$

  userValid = (user: UserProfile) => {
    return (user.genre !== '')
    // return (user.genre !== '' && user.sub !== '')
  }

  genre$ = (user: UserProfile) => this.liveContentService.subGenre$(user.genre)

  genreImage = (user: UserProfile) => (user.sub !== '') ? `assets/images/content/genre/${user.sub}.jpg` : user.content.backgroundImage

  constructor(
    private globalDataStorageService: GlobalDataStorageService,
    private usersService: UsersService,
    private liveContentService: LiveContentService,
    private videoService: VideoService,
  ) { }

  ngOnInit() {

    const ok = this.globalDataStorageService.initDataStore('quickplay')
    if(!ok) this.globalDataStorageService.createStore('quickplay')

    this.usersService.initUsers()
    this.liveContentService.initGenres()

    this. bkImage$.subscribe(data => console.log('CHANGED', data))
  }

  ngAfterViewInit(): void {

  }

  reset() {

  }

  onSelectedTab(tab: number, user?: UserProfile) {
    this.selectedTab = tab
    // this.liveContentService.getLivePrograms(user)
    // console.log('USER')
  }

  onSelectedSubGenre(data: UserProfile, subGenre: string) {
    data.sub = subGenre
    this.usersService.updateUser(data)
    this.liveContentService.getLivePrograms(data)
  }

  // onChangedUserProfiles(data: UserProfile[]) {

  // }

  // onSelectedTab(tabChangeEvent: MatTabChangeEvent, users: UserProfile[]) {

  //   this.selectedTab = tabChangeEvent.index

  //   if(this.selectedTab > 0) {
  //     // this.videoService.pause()
  //     const userStream = users[this.selectedTab-1].content.stream_url
  //     this.videoService.playNextVideo(userStream)
  //     // console.log(this.selectedTab, users[this.selectedTab-1])
  //     // this.videoService.play()
  //   }

  // }

}
