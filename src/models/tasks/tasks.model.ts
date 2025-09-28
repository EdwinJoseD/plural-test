import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TasksType } from './tasks.type';
import { ProjectsModel } from '../projects/projects.model';
import { UserModel } from '../users/user.models';

const tasks = sequelize.define<Model<TasksType>>(
  'tasks',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      field: 'project_id',
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      field: 'assigned_to',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      field: 'created_by',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'estimated_hours',
    },
    actualHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'actual_hours',
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tasks',
  }
);

export const TasksModel = tasks;

TasksModel.belongsTo(ProjectsModel, {
  foreignKey: 'project_id',
  as: 'project',
});
TasksModel.belongsTo(UserModel, {
  foreignKey: 'assigned_to',
  as: 'assignee',
});
TasksModel.belongsTo(UserModel, {
  foreignKey: 'created_by',
  as: 'creator',
});

UserModel.hasMany(TasksModel, {
  foreignKey: 'assigned_to',
  as: 'assignedTasks',
});
UserModel.hasMany(TasksModel, {
  foreignKey: 'created_by',
  as: 'createdTasks',
});
ProjectsModel.hasMany(TasksModel, {
  foreignKey: 'project_id',
  as: 'tasks',
});
