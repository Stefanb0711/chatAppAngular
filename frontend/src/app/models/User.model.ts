export interface UserModel{
  id: number,
  username: string,
  email: string,
  password: string,
  contacts_of_user: number[],
  profile_picture: string
}
