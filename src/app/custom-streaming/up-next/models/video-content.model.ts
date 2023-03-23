import { VideoContentDetailsData } from "./video-content-details.model"

export interface VideoContentDataInterface {
  poster: string
  image: string
  timeStart: number
  timeEnd: number
  details: VideoContentDetailsData
}

export class VideoContentData implements VideoContentDataInterface {

  constructor(
    public poster = '',
    public image = '',
    public timeStart = Math.floor(new Date().getTime() / 1000),
    public timeEnd = Math.floor(new Date().getTime() / 1000),
    public details = VideoContentDetailsData.adapt()
    ) {}

  static adapt(item?: any): VideoContentData {

    const timeStartData = (item?.timeStartIOS) ? new Date(item.timeStart).getTime() / 1000 : item?.timeStart
    const timeEndData = (item?.timeEndISO) ? new Date(item.timeEnd).getTime() / 1000 : item?.timeEnd

    return new VideoContentData(
      item?.poster,
      item?.image,
      timeStartData,
      timeEndData,
      (item?.details) ? VideoContentDetailsData.adapt(item?.details) : VideoContentDetailsData.adapt(),
    )

  }

}
