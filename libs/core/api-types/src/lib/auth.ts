export interface LoginUser {
  email: string;
  password: string;
}

export interface NewUser extends LoginUser {
  username: string;
}
