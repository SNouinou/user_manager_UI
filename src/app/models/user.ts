import { Profile } from "./profile";

export interface User {
  id: string;
  username: string;
  profile: Profile;
  enabled: boolean;
}
