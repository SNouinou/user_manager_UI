import { User } from './user';

export class UserRow {
  id: string;
  username: string;
  roles: string[];
  enabled: boolean;
  delete: { loading: boolean };
  disable: { loading: boolean };

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.roles = user.profile.roles;
    this.enabled = user.enabled;
    this.delete = { loading: false };
    this.disable = { loading: false };
  }

  static toUser(userRow: UserRow): User {
    return {
      id: userRow.id,
      username: userRow.username,
      profile: { roles: userRow.roles },
      enabled: userRow.enabled,
    };
  }
}
