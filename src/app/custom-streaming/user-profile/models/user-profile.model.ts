import { BaselineVideo } from "./baseline-video.model"

export interface UserProfileInterface {
  user_id: number
  gender: string
  name: string
  email: string
  image: string
  genre: string
  sub: string
  active: boolean
  content: BaselineVideo
}

export class UserProfile implements UserProfileInterface {

  constructor(
    public user_id = Math.floor(Math.random() * 999) + 1,
    public gender = '',
    public name = '',
    public email = '',
    public image = '',
    public genre = '',
    public sub = '',
    public active = false,
    public content = BaselineVideo.adapt(),
    ) {}

  static adapt(item?: any): UserProfile {

    return new UserProfile(
      item?.user_id,
      item?.gender,
      (item?.name) ? `${item.name.first} ${item.name.last}` : '',
      item?.email,
      item?.picture.large,
      item?.genre,
      item?.sub,
      item?.active,
      (item?.content) ? BaselineVideo.adapt(item.content) : BaselineVideo.adapt(),
    )

  }

}
