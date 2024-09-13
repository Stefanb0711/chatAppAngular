export interface UserModel{
  id: number | null,
  username: string,
  email: string,
  password: string,
  contacts_of_user: number[],
  profile_picture: string
}
