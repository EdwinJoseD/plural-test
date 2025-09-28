import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { UserType } from './users.type';

const users = sequelize.define<Model<UserType>>(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'manager'),
      allowNull: false,
      defaultValue: 'user',
    },
    firstName: { type: DataTypes.STRING, field: 'first_name' },
    lastName: { type: DataTypes.STRING, field: 'last_name' },
    avatarUrl: { type: DataTypes.STRING, field: 'avatar_url' },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified',
    },
    lastLogin: { type: DataTypes.DATE, field: 'last_login' },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
  }
);

export const UserModel = users;
