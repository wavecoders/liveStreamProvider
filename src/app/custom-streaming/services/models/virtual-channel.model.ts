import { BaseLiveBasic } from './base-channel-basic.model';
import { BaseLive } from './base-channel.model';

export interface VirtualChannelInterface {
  name: string
  environmentTags: string[]
  baseLive: BaseLive|BaseLiveBasic
}

export class VirtualChannel implements VirtualChannelInterface {

  constructor(
    public name = '',
    public environmentTags: string[] = [],
    public baseLive: any = {},
    ) {}

  static adapt(item?: any): VirtualChannel {

    return new VirtualChannel(
      (item?.name).replace(/ /g,"_"),
      item?.environmentTags,
      item?.baseLive,
    )

  }

}
