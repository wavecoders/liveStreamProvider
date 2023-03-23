import { environment } from "src/environments/enviroment"

export interface PersonDataInterface {
  adult: boolean
  gender: number
  id: number
  name: string
  popularity: number
  image: string
}

export class PersonData implements PersonDataInterface {

  constructor(
    public adult = false,
    public gender = 0,
    public id = 0,
    public name = '',
    public popularity = 0,
    public image = '',
    ) {}

  static adapt(item: any): PersonData {

    return new PersonData(
      item.adult,
      item.gender,
      item.id,
      item.name,
      item.popularity,
      environment.images + item.profile_path,
    )

  }

}
