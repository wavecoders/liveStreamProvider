export interface UserInfoInterface {
  id: number
  name: string
}

export class UserInfo implements UserInfoInterface {

  constructor(
    public id = 0,
    public name = '',
    ) {}

  static adapt(item?: any): UserInfo {

    return new UserInfo(
      item?.id,
      item?.name,
    )

  }

}
