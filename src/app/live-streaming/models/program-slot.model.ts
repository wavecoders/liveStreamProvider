// {
//   "name": "Virtual Channel Program A",
//   "startTime": "2023-03-15T10:56:28.746Z",
//   "duration": 120,
//   "replacement": {
//         "id": 35677
//    }
// }

import { ProgramReplacement } from "./program-replacement.model"

export interface ProgramSlotInterface {
  id: number
  name: string
  startTime: string
  duration: number
  replacement: ProgramReplacement
}

export class ProgramSlot implements ProgramSlotInterface {

  constructor(
    public id = 0,
    public name = '',
    public startTime = new Date().toISOString(),
    public duration = 0,
    public replacement = ProgramReplacement.adapt(),
    ) {}

  static adapt(item?: any): ProgramSlot {

    return new ProgramSlot(
      item?.id,
      item?.name,
      (item?.startTime) ? item?.startTime : new Date().toISOString(),
      item?.duration,
      (item?.replacement) ? ProgramReplacement.adapt(item?.replacement) : ProgramReplacement.adapt(),
    )

  }

}
