import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { AttachmentType } from './attachments.type';
import { TasksModel } from '../tasks/tasks.model';
import { UserModel } from '../users/user.models';

const attachments = sequelize.define<Model<AttachmentType>>(
  'attachments',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'task_id',
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_name',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mime_type',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'file_size',
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      field: 'uploaded_by',
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    tableName: 'attachments',
  }
);

export const AttachmentsModel = attachments;

AttachmentsModel.belongsTo(TasksModel, { foreignKey: 'taskId', as: 'task' });
TasksModel.hasMany(AttachmentsModel, {
  foreignKey: 'taskId',
  as: 'attachments',
});

AttachmentsModel.belongsTo(UserModel, {
  foreignKey: 'uploadedBy',
  as: 'uploader',
});
UserModel.hasMany(AttachmentsModel, {
  foreignKey: 'uploadedBy',
  as: 'uploadedAttachments',
});
