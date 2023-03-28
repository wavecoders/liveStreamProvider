import { BaseLive } from '../../custom-streaming/services/models/base-channel.model';

// {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel

// {
//   "name": "Jeffrey Richards",
//   "environmentTags": [
//     "Prod"
//   ],
//   "baseLive": {
//     "id": 34270,
//     "name": "",
//     "url": "",
//     "type": "live"
//   }
// }

export interface VirtualChannelDataInterface {
  name: string
  environmentTags: string[]
  baseLive: BaseLive
}

export class VirtualChannelData implements VirtualChannelDataInterface {

  constructor(
    public name = '',
    public environmentTags = ['Prod'],
    public baseLive = BaseLive.adapt(),
    ) {}

  static adapt(item?: any): VirtualChannelData {

    return new VirtualChannelData(
      item?.name,
      item?.environmentTags,
      (item?.baseLive) ? BaseLive.adapt(item?.baseLive) : BaseLive.adapt(),
    )

  }

}
