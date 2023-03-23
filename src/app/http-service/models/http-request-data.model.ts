export interface HttpRequestDataInterface {
  page: number,
  results: any[],
  total_pages: number,
  total_results: any[]
}

export class HttpRequestData implements HttpRequestDataInterface {

  constructor(
    public page = 0,
    public results = [],
    public total_pages = 0,
    public total_results = [],
    ) {}

  static adapt(item: any): HttpRequestData {

    return new HttpRequestData(
      item.page,
      item.results,
      item.total_pages,
      item.total_results,
    )

  }

}
