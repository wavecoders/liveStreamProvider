export interface BaseLiveBasicInterface {
  id: number
}

export class BaseLiveBasic implements BaseLiveBasicInterface {

  constructor(
    public id = 0,
    ) {}

  static adapt(item?: any): BaseLiveBasic {

    return new BaseLiveBasic(
      item?.id,
    )

  }

}
