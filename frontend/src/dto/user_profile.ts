import type { UserDto } from './user';

export type UserProfileDto = UserDto & {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  // Add more profile fields as needed
};