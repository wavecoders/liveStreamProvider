// [
//   {
//       "id": 35679,
//       "name": "Antony Burdain Parts Unknown",
//       "type": "asset",
//       "url": "https://storage.googleapis.com/flm-gcp-lab-live/vod/travel-02/manifest.m3u8",
//       "format": "HLS"
//   },
// ]

export interface StreamingSourcesDataInterface {
  id: number
  name: string
  type: string
  url: string
  format: string
}

export class StreamingSourcesData implements StreamingSourcesDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public type = '',
    public url = '',
    public format = '',
    ) {}

  static adapt(item?: any): StreamingSourcesData {

    return new StreamingSourcesData(
      item?.id,
      item?.name,
      item?.type,
      item?.url,
      item?.format,
    )

  }

}
