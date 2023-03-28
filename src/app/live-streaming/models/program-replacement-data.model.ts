export interface ProgramReplacementDataInterface {
  id: number
  name: string
  type: string
  url: string
}

export class ProgramReplacementData implements ProgramReplacementDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public type = '',
    public url = '',
    ) {}

  static adapt(item?: any): ProgramReplacementData {

    return new ProgramReplacementData(
      item?.id,
      item?.type,
      item?.name,
      item?.url,
    )

  }

}
