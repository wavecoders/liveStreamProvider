export interface LiveContentDataInterface {
  id: number
  name: string
  type: string
  url: string
  format: string
  description: string
  genre: string
  sub: string
  poster: string
  image: string
}

export class LiveContentData implements LiveContentDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public type = '',
    public url = '',
    public format = '',
    public description = '',
    public genre = '',
    public sub = '',
    public poster = '',
    public image = '',
    ) {}

  static adapt(item?: any): LiveContentData {

    const desc = (item?.description !== '') ? item?.description.split('promo for') : []
    const genre = (desc.length > 0) ? desc[0].split(' ') : []

    return new LiveContentData(
      item?.id,
      item?.name,
      item?.type,
      item?.url,
      item?.format,
      (desc.length > 0) ? desc[0].trim() : '',
      (genre.length > 0) ? genre[1].trim().toLowerCase() : '',
      (genre.length > 0) ? genre[0].trim().toLowerCase() : '',
      item?.poster,
      item?.image,
    )

  }

}
