import { BaseLive } from '../../custom-streaming/services/models/base-channel.model';
// {{API_SCHEME}}://{{API_ROOT}}/services/virtual-channel

// {
//   "id": 19615,
//   "name": "Mike Boni",
//   "baseLive": {
//       "id": 34270,
//       "name": "ch1-documentary",
//       "url": "https://storage.googleapis.com/flm-gcp-lab-live/live/ch1-blmbrg/main.m3u8",
//       "type": "live"
//   },
//   "environmentTags": [
//       "Prod"
//   ],
//   "url": "https://stream.broadpeak.io/17c276c8e723eb46ab05319383e8906d/flm-gcp-lab-live/live/ch1-blmbrg/main.m3u8",
//   "creationDate": "2023-03-25T12:49:06.000Z",
//   "updateDate": "2023-03-25T12:49:06.000Z"
// }

export interface UserChannelDataInterface {
  id: number
  name: string
  baseLive: BaseLive
  type: string
  url: string
  environmentTags: string[]
  creationDate: string
  updateDate: string
}

export class UserChannelData implements UserChannelDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public baseLive = BaseLive.adapt(),
    public type = '',
    public url = '',
    public environmentTags = ['Prod'],
    public creationDate = new Date().toISOString(),
    public updateDate = new Date().toISOString(),
    ) {}

  static adapt(item?: any): UserChannelData {

    return new UserChannelData(
      item?.id,
      item?.name,
      (item?.baseLive) ? BaseLive.adapt(item?.baseLive) : BaseLive.adapt(),
      item?.type,
      item?.url,
      item?.environmentTags,
      item?.creationDate,
      item?.updateDate,
    )

  }

  creationDateEpoch(): number {
    return new Date(this.creationDate).getTime() / 1000
  }

  updateDateEpoch(): number {
    return new Date(this.updateDate).getTime() / 1000
  }

}
