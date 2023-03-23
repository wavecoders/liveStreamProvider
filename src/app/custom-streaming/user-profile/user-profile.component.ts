import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';

import { UserProfile } from './models/user-profile.model';

import { LiveContentService } from '../services/live-content.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  _user?: UserProfile
  @Input() set user(value: UserProfile) {
    this._user = value
  }

  get user(): any {
    return this._user
  }

  get isValid() {
    return (this.user.genre)
  }

  bk = 'https://img.freepik.com/free-photo/big-city_1127-3102.jpg?w=2000&t=st=1678626520~exp=1678627120~hmac=887d56b352f985d31538c5ea603419b5df1fa4c2c1d642dc5321db5ae2f3d57b'

  get bkImage() {
    return (this.user.content.backgroundImage !== '') ? this.user.content.backgroundImage : this.bk
  }

  isActive = false

  @Output() changed = new EventEmitter()
  @Output() deleted = new EventEmitter()
  @Output() liveStream = new EventEmitter()

  genreFile = 'streaming-genre.json'

  mainGenre$ = this.liveContentService.mainGenre$
  contentChanged$ = this.liveContentService.contentChanged$

  genreControl = this.fb.control('', Validators.required)

  constructor(
    private fb: FormBuilder,
    private liveContentService: LiveContentService,
  ) {}

  ngOnInit() {

    if(this.user.genre !== '') {
      this.genreControl.patchValue(this.user.genre)
      this.isActive = true
    }

    this.genreControl.valueChanges.pipe(
      map((item) => {
        if(this.user) this.user.genre = (item) ? item : ''
        this.changed.next(this.user)
      }),
    ).subscribe()

    this.contentChanged$.subscribe(data => console.log('CONTENT FINISHED'))

  }

  onCreateLiveStream() {
    this.isActive = true
    this.user.active = !this.user.active
    this.changed.next(this.user)
    this.liveStream.emit(this.user)
  }

  onDelete() {
    this.deleted.emit(this.user)
  }

}
