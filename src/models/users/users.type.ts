export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

export type UserType = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type CreateUserDTO = {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export type RegisterUserType = Omit<UserType, 'id'>;
