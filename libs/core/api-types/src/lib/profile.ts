export interface Profile {
  username: string;
  image: string;
  following: boolean;
  loading: boolean;
}

export interface ProfileResponse {
  profile: Profile;
}
