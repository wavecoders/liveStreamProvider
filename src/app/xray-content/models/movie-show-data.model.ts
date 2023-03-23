import { environment } from "src/environments/enviroment"

export interface MovieShowDataInterface {
  title: string
  overview: string
  image: string
  backdrop: string
}

export class MovieShowData implements MovieShowDataInterface {

  constructor(
    public title = '',
    public overview = '',
    public image = '',
    public backdrop = '',
    ) {}

  static adapt(item: any): MovieShowData {

    return new MovieShowData(
      (item.title).replace(/:/g,""),
      item.overview,
      environment.images + item.poster_path,
      environment.images + item.backdrop_path,
    )

  }

}
