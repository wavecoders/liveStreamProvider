// {{API_SCHEME}}://{{API_ROOT}}/services?offset=&limit=10

// [
//   {
//       "id": 19614,
//       "name": "دانیال_رضاییان",
//       "type": "virtual-channel",
//       "url": "https://stream.broadpeak.io/17c276c8e723eb46ca8263228bee4be9/flm-gcp-lab-live/live/ch1-blmbrg/main.m3u8",
//       "environmentTags": [
//           "Prod"
//       ],
//       "creationDate": "2023-03-25T12:05:38.000Z",
//       "updateDate": "2023-03-25T12:05:38.000Z"
//   }
// ]

export interface UserChannelStreamDataInterface {
  id: number
  name: string
  type: string
  url: string
  environmentTags: string[]
  creationDate: string
  updateDate: string
}

export class UserChannelStreamData implements UserChannelStreamDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public type = '',
    public url = '',
    public environmentTags = ['Prod'],
    public creationDate = new Date().toISOString(),
    public updateDate = new Date().toISOString(),
    ) {}

  static adapt(item?: any): UserChannelStreamData {

    return new UserChannelStreamData(
      item?.id,
      item?.name,
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
