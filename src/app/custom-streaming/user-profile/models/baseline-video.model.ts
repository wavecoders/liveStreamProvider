export interface BaselineVideoInterface {
  name: string
  description: string
  stream_url: string
  stream_id: number
  backgroundImage: string
}

export class BaselineVideo implements BaselineVideoInterface {

  constructor(
    public name = '',
    public description = '',
    public stream_url = '',
    public stream_id = 0,
    public backgroundImage = '',
    ) {}

  static adapt(item?: any): BaselineVideo {

    return new BaselineVideo(
      item?.name,
      item?.description,
      item?.stream_url,
      item?.stream_id,
      item?.backgroundImage,
    )

  }

}




