import { BaseLive } from '../../custom-streaming/services/models/base-channel.model';

// {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel

// {
//   "name": "Jeffrey Richards",
//   "baseLive": {
//     "id": 34270,
//     "name": "",
//     "url": "",
//     "type": "live"
//   }
// }

export interface UserVirtualChannelInterface {
  name: string
  baseLive: BaseLive
}

export class UserVirtualChannel implements UserVirtualChannelInterface {

  constructor(
    public name = '',
    public baseLive = BaseLive.adapt(),
    ) {}

  static adapt(item?: any): UserVirtualChannel {

    return new UserVirtualChannel(
      item?.name,
      (item?.baseLive) ? BaseLive.adapt(item?.baseLive) : BaseLive.adapt(),
    )

  }

}
