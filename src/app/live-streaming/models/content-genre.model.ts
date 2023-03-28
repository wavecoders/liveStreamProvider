export interface ContentGenreInterface {
  main: string
  sub: string
}

export class ContentGenre implements ContentGenreInterface {

  constructor(
    public main = '',
    public sub = '',
    ) {}

  static adapt(item?: any): ContentGenre {

    return new ContentGenre(
      item?.main,
      item?.sub,
    )

  }

}
