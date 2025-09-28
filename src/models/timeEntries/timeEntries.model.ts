import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TimeEntryType } from './timeEntries.type';
import { UserModel } from '../users/user.models';
import { TasksModel } from '../tasks/tasks.model';

const timeEntries = sequelize.define<Model<TimeEntryType>>(
  'time_entries',
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_time',
    },
    hoursLogged: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'hours_logged',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    tableName: 'time_entries',
  }
);

export const TimeEntriesModel = timeEntries;

TimeEntriesModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(TimeEntriesModel, {
  foreignKey: 'userId',
  as: 'timeEntries',
});

TimeEntriesModel.belongsTo(TasksModel, { foreignKey: 'taskId', as: 'task' });
TasksModel.hasMany(TimeEntriesModel, {
  foreignKey: 'taskId',
  as: 'timeEntries',
});
