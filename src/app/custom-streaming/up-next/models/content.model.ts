import { ContentReplacement } from "./content-replacement.model"

export interface ContentDataInterface {
  id: number
  name: string
  startTime: number
  endTime: number
  duration: number
  category: string
  replacement: ContentReplacement
}

export class ContentData implements ContentDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public startTime = ContentData.getEpoch(),
    public endTime = ContentData.getEpoch(),
    public duration = 0,
    public category = '',
    public replacement = ContentReplacement.adapt(),
    ) {}

  static adapt(item?: any): ContentData {

    return new ContentData(
      item?.id,
      item?.name,
      item?.startTime,
      (item?.endTime) ? ContentData.getEpoch(item.endTime) : ContentData.getEpoch(),
      item?.duration,
      item?.category,
      (item?.replacement) ? ContentReplacement.adapt(item.replacement) : ContentReplacement.adapt(),
    )

  }

  private static getEpoch(dateTime?: string): number {
    return (dateTime) ? new Date(dateTime).getTime() / 1000 : new Date().getTime() / 1000
  }

}
