import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TaskCommentType } from './taskComments.type';
import { UserModel } from '../users/user.models';
import { TasksModel } from '../tasks/tasks.model';

const taskComment = sequelize.define<Model<TaskCommentType>>(
  'task_comments',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    tableName: 'task_comments',
  }
);

export const TaskCommentsModel = taskComment;

TaskCommentsModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(TaskCommentsModel, {
  foreignKey: 'userId',
  as: 'taskComments',
});

TaskCommentsModel.belongsTo(TasksModel, { foreignKey: 'taskId', as: 'task' });
TasksModel.hasMany(TaskCommentsModel, {
  foreignKey: 'taskId',
  as: 'taskComments',
});
