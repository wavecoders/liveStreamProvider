// {
//   "name": "Virtual Channel Program A",
//   "startTime": "2023-03-15T10:56:28.746Z",
//   "duration": 120,
//   "replacement": {
//         "id": 35677
//    }
// }

import { ProgramReplacementData } from './program-replacement-data.model';

export interface ProgramSlotDataInterface {
  id: number
  name: string
  startTime: string
  endTime: string
  duration: number
  category: string
  replacement: ProgramReplacementData
}

export class ProgramSlotData implements ProgramSlotDataInterface {

  constructor(
    public id = 0,
    public name = '',
    public startTime = new Date().toISOString(),
    public endTime = new Date().toISOString(),
    public duration = 0,
    public category = '',
    public replacement = ProgramReplacementData.adapt(),
    ) {}

  static adapt(item?: any): ProgramSlotData {

    return new ProgramSlotData(
      item?.id,
      item?.name,
      (item?.startTime) ? item?.startTime : new Date().toISOString(),
      (item?.endTime) ? item?.endTime : new Date().toISOString(),
      item?.duration,
      item?.category,
      (item?.replacement) ? ProgramReplacementData.adapt(item?.replacement) : ProgramReplacementData.adapt(),
    )

  }

}
