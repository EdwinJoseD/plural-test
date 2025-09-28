import { sequelize } from '@/config/database/connection.sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TagType } from './tags.type';

const tags = sequelize.define<Model<TagType>>(
  'tags',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tags',
  }
);

export const TagsModel = tags;
