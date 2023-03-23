export interface GenreDataInterface {
  genre: string
  sub: string[]
}

export class GenreData implements GenreDataInterface {

  constructor(
    public genre = '',
    public sub: string[] = [],
    ) {}

  static adapt(item?: any): GenreData {

    return new GenreData(
      item?.genre,
      item?.sub,
    )

  }

}
