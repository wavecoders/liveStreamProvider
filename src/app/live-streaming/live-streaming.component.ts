import { UserInfo } from './models/user-info.model';
import { Component, OnInit } from '@angular/core';
import { VideoStreamService } from './services/video-stream.service';
import { first } from 'rxjs';

import { UserChannelStreamData } from './models/user-channel-stream.model';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.css']
})
export class LiveStreamingComponent implements OnInit {

  // All Virtual Channels - Users
  streamServices$ = this.videoStreamService.userStreams$
  streamingChannels$ = this.videoStreamService.streamingChannels$

  getAsset$ = (id: number) => this.videoStreamService.getAsset$(id)

  // live$ = this.videoStreamService.streamingLiveContent$()
  // content$ = this.videoStreamService.streamingContent$()

  // userSlots$ = this.videoStreamService.liveProgramSlots$({ id: 19627, name: 'Mike Boni' })

  // user$?: Observable<UserChannelData>

  constructor(
    private videoStreamService: VideoStreamService,
    private usersService: UsersService
  ) { }

  ngOnInit() {

    this.videoStreamService.getUserStreams().subscribe(() => console.log('SERVICES'))

    this.usersService.users$.subscribe((data: any[]) => console.log('USERS:', data))

    // this.usersService.clearUsers()

    // this.usersService.createUser().subscribe((data) => console.log('CREATED USER: ', data))
    // this.usersService.createUser().subscribe((data) => console.log('CREATED USER: ', data))
    // this.usersService.createUser().subscribe((data) => console.log('CREATED USER: ', data))

    const user = {
      "user_id": 331,
      "gender": "female",
      "name": "Nella Tuomi",
      "email": "nella.tuomi@example.com",
      "image": "https://randomuser.me/api/portraits/women/95.jpg",
      "genre": "",
      "sub": "",
      "active": false
    }
    this.usersService.deleteUser(user).subscribe((data) => console.log('DELETED USER: '))

    // const subGenre = 'travel'
    // this.videoStreamService.createUserProgramSlots({ id: 19627, name: 'Mike Boni' }, subGenre).subscribe(console.log)

    // this.videoStreamService.deleteAllUserStreams().subscribe(data => console.log(data))
    // this.videoStreamService.deleteUserStream({ id: 19615, name: 'Mike Boni' }).subscribe(data => console.log(data))

    // this.user$ = this.videoStreamService.createUserStream({ name: 'Mike Bonifacio' })

    // this.videoStreamService.getAsset$(35679).subscribe(data => console.log(data))
    // this.videoStreamService.getAsset$(35676).subscribe(data => console.log(data))

  }

  // CREATE CHANNEL
  onCreateUserChannel(genre: any, asset: any) {

    // const genre = 'documentary'
    const user = UserInfo.adapt({ id: 19627, name: 'Mike Boni' })

    this.videoStreamService.createUserStream(user, genre)
    .subscribe(data => {
      console.log('CREATED: ',data)
      console.log(genre, asset)
    })

  }

  // DELETE CHANNEL
  onDeleteUserChannel(userChannel: UserChannelStreamData) {
    this.videoStreamService.deleteUserStream(userChannel).subscribe(() => {
      console.log('DELETED: ', userChannel)
    })
  }

  // DELETE ALL CHANNELS
  onDeleteAllUserChannels() {
    this.videoStreamService.deleteAllUserStreams().subscribe(() => {
      console.log('DELETED ALL CHANNELS ')
    })
  }

}
