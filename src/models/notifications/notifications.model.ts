import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { NotificationType } from './notifications.type';
import { UserModel } from '../users/user.models';

const notification = sequelize.define<Model<NotificationType>>(
  'notifications',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'user_id',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'related_id',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    timestamps: false,
    tableName: 'notifications',
  }
);

export const NotificationsModel = notification;

NotificationsModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(NotificationsModel, {
  foreignKey: 'userId',
  as: 'notifications',
});
