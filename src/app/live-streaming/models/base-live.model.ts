// "baseLive": {
//   "id": 34270,
//   "name": "",
//   "url": "",
//   "type": "live"
// }

export interface BaseLiveDataInterface {
  id: number
  name: string
  type: string
  url: string
}

export class BaseLiveData implements BaseLiveDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public type = '',
    public url = '',
    ) {}

  static adapt(item?: any): BaseLiveData {

    return new BaseLiveData(
      item?.id,
      item?.name,
      item?.type,
      item?.url,
    )

  }

}
