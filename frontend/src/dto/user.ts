export type UserDto = {
  id: string;
  accountId: string;
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
};