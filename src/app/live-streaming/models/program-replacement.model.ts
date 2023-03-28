export interface ProgramReplacementInterface {
  id: number
}

export class ProgramReplacement implements ProgramReplacementInterface {

  constructor(
    public id = 0,
    ) {}

  static adapt(item?: any): ProgramReplacement {

    return new ProgramReplacement(
      item?.id,
    )

  }

}
