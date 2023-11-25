import { User } from './user';

export class UserRow {
  id: string;
  username: string;
  role: string;
  enabled: boolean;
  delete: { loading: boolean };
  disable: { loading: boolean };

  constructor(user: User) {
    debugger;
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.enabled = user.enabled;
    this.delete = { loading: false };
    this.disable = { loading: false };
  }

  static toUser(userRow: UserRow): User {
    return {
      id: userRow.id,
      username: userRow.username,
      role: userRow.role,
      enabled: userRow.enabled,
    };
  }
}
