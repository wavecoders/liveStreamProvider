import { environment } from "src/environments/enviroment"

export interface XrayDataInterface {
  name: string
  file: string
  data: any[]
}

export class XrayData implements XrayDataInterface {

  constructor(
    public name = '',
    public file = '',
    public data = [],
    ) {}

  static adapt(item: any): XrayData {

    return new XrayData(
      item.name,
      item.file,
      item.data,
    )

  }

}
