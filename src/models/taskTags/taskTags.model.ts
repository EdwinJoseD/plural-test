import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TaskTagType } from './taskTags.type';

const taskTags = sequelize.define<Model<TaskTagType>>(
  'task_tags',
  {
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
      field: 'task_id',
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
      field: 'tag_id',
    },
  },
  {
    timestamps: false,
    tableName: 'task_tags',
  }
);

export const TaskTagsModel = taskTags;

TaskTagsModel.removeAttribute('id');
