import { BaseLive } from './base-channel.model';

export interface ChannelDataInterface {
  id: number
  name: string
  baseLive: BaseLive
  environmentTags: string[]
  url: string
  creationDate: Date
  updateDate: Date
}

export class ChannelData implements ChannelDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public baseLive = BaseLive.adapt(),
    public environmentTags = [],
    public url = '',
    public creationDate = new Date(),
    public updateDate = new Date(),
    ) {}

  static adapt(item?: any): ChannelData {

    return new ChannelData(
      item?.id,
      item?.name,
      (item?.baseLive) ? BaseLive.adapt(item.baseLive) : BaseLive.adapt(),
      item?.environmentTags,
      item?.url,
      new Date(item?.creationDate),
      new Date(item?.updateDate),
    )

  }

}
