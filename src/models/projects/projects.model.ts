import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { ProjectsType } from '../projects/projects.type';
import { UserModel } from '../users/user.models';

const projects = sequelize.define<Model<ProjectsType>>(
  'projects',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'archived', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
    },
    startDate: { type: DataTypes.DATE, field: 'start_date' },
    endDate: { type: DataTypes.DATE, field: 'end_date' },
    budget: { type: DataTypes.DECIMAL(10, 2) },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id',
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'projects',
  }
);

export const ProjectsModel = projects;

ProjectsModel.belongsTo(UserModel, {
  foreignKey: 'owner_id',
  as: 'owner',
});
UserModel.hasMany(ProjectsModel, {
  foreignKey: 'owner_id',
  as: 'projects',
});
