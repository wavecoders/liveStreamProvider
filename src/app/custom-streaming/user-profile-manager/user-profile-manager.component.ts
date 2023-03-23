import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UserProfile } from './../user-profile/models/user-profile.model';
import { UsersService } from '../services/users.service';
import { LiveContentService } from '../services/live-content.service';
import { LiveContentData } from '../up-next/models/live-content.model';
import { VirtualChannelService } from '../services/virtual-channel.service';
import { ChannelData } from '../services/models/channel.model';

@Component({
  selector: 'app-user-profile-manager',
  templateUrl: './user-profile-manager.component.html',
  styleUrls: ['./user-profile-manager.component.css']
})
export class UserProfileManagerComponent implements OnInit {

  users$: Observable<UserProfile[]> = this.usersService.users$

  constructor(
    private usersService: UsersService,
    private liveContentService: LiveContentService,
    private virtualChannelService: VirtualChannelService,
  ) {}

  ngOnInit() {
  }

  onCreateUser() {
    this.usersService.createUser()
  }

  onClearUsers() {
    this.usersService.clearUsers()
  }

  onDeleteUser(data: UserProfile) {
    this.usersService.deleteUser(data)
  }

  onCreateLiveStream(user: UserProfile) {

    this.liveContentService.liveContent$?.pipe(

      map((data: LiveContentData[]) => {

        const foundLive: LiveContentData[] = data.filter((item:LiveContentData) => item.type === 'live' && item.genre === user.genre.toLowerCase())
        const content = (foundLive.length > 0) ? foundLive[0] : undefined

        if(!content) {
          console.log('NO LIVE STREAMS AVAILABLE')
          return
        }

        const appropriateContent = data.filter((item:any) => item.genre === user.genre)
        const selectedLiveStream = (appropriateContent.length > 0) ? appropriateContent[1] : undefined

        const pick = Math.floor(Math.random() * 5) + 1
        const img = `/assets/images/${user.genre}/${user.genre}-${pick}.webp`

        user.content.backgroundImage = img
        user.content.name = content.name
        user.content.description = content.description
        user.content.stream_id = content.id

        this.virtualChannelService.createVirtualChannel(user)
        .subscribe((data: ChannelData) => {
          user.user_id = data.id
          user.content.stream_url = data.url
          this.usersService.updateUser(user)
        })


        return selectedLiveStream

      })

    )
    .subscribe((data: any) => console.log('LIVE:',data))

  }

}
