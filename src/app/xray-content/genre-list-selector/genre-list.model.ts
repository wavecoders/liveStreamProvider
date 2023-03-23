import { environment } from "src/environments/enviroment"

export interface GenreListDataInterface {
  name: string
  percent: number
}

export class GenreListData implements GenreListDataInterface {

  constructor(
    public name = '',
    public percent = 0,
    ) {}

  static adapt(item: any): GenreListData {

    return new GenreListData(
      item.name,
      item.percent,
    )

  }

}
