import { environment } from "src/environments/enviroment"

export interface MergeImageOptionsInterface {
  format: string
  quality: number
  width: undefined | number
  height: undefined | number
  offsetBy: { x: number, y: number }
  Canvas: undefined | any
  crossOrigin: undefined | string
}

export class MergeImageOptions implements MergeImageOptionsInterface {

  constructor(
    public format = 'image/png',
    public quality = 0.92,
    public width = undefined,
    public height = undefined,
    public offsetBy = { x: 0, y: 0 },
    public Canvas = undefined,
    public crossOrigin = 'anonymous'
    ) {}

  static adapt(item: any): MergeImageOptions {

    return new MergeImageOptions(
      item.format,
      item.quality,
      item.width,
      item.height,
      item.offsetBy,
      item.Canvas,
      item.crossOrigin,
    )

  }

}
