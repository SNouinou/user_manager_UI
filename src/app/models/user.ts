import { Profile } from "./profile";

export interface User {
  id: string;
  username: string;
  roles: string[];
  enabled: boolean;
}
