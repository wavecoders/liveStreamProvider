import { ContentReplacement } from "./content-replacement.model"

export interface VideoContentDetailsDataInterface {
  title: string
  description: string
}

export class VideoContentDetailsData implements VideoContentDetailsDataInterface {

  constructor(
    public title = '',
    public description = '',
    ) {}

  static adapt(item?: any): VideoContentDetailsData {

    return new VideoContentDetailsData(
      item?.title,
      item?.description,
    )

  }

}
