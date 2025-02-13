export enum IUserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  fullName?: string;
  email: string;
  role: IUserRole;
  profilePicture?: string;
  status?: string;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  phoneNumber?: string;
}

export interface UserResponse {
  user: IUser & { accessToken: string };
}

export interface IUserTable {
  data: IUser[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
