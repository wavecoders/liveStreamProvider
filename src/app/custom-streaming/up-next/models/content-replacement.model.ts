export interface ContentReplacementInterface {
  id: number
  type: string
  name: string
  url: string
}

export class ContentReplacement implements ContentReplacementInterface {

  constructor(
    public id = 0,
    public type = '',
    public name = '',
    public url = '',
    ) {}

  static adapt(item?: any): ContentReplacement {

    return new ContentReplacement(
      item?.id,
      item?.type,
      item?.name,
      item?.url,
    )

  }

}
