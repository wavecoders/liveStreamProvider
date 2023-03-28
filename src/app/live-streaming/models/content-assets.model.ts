import { ContentGenre } from "./content-genre.model"

export interface ContentAssetDataInterface {
  id: number
  name: string
  poster: string
  image: string
  description: string
  genre: ContentGenre
}

export class ContentAssetData implements ContentAssetDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public poster = '',
    public image = '',
    public description = '',
    public genre = ContentGenre.adapt(),
    ) {}

  static adapt(item?: any): ContentAssetData {

    const genreObj: string[] = (item?.genre) ? item.genre.split('/') : []

    const genre = (genreObj.length > 0)
      ? ContentGenre.adapt({ main: genreObj[0].toLowerCase(), sub: genreObj[1].toLowerCase() })
      : ContentGenre.adapt()

    return new ContentAssetData(
      item?.id,
      item?.name,
      item?.poster,
      item?.image,
      item?.description,
      genre,
    )

  }

}
