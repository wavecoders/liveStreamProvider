export interface BaseLiveInterface {
  id: number
  name: string
  url: string
  type: string
}

export class BaseLive implements BaseLiveInterface {

  constructor(
    public id = 0,
    public name = '',
    public url = '',
    public type = 'live',
    ) {}

  static adapt(item?: any): BaseLive {

    return new BaseLive(
      item?.id,
      item?.name,
      item?.url,
      item?.type,
    )

  }

}
