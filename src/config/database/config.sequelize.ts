// src/database/config.ts - Configuración de Sequelize con TypeScript
import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  [key: string]: Options;
}

const config: DatabaseConfig = {
  development: {
    username: process.env.DB_USER || 'dev_user',
    password: process.env.DB_PASSWORD || 'dev_password',
    database: process.env.DB_NAME || 'mi_app_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log, // Para ver las queries en desarrollo
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    timezone: '-05:00', // Bogotá
  },

  test: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_NAME_TEST || 'mi_app_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  },

  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000,
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  },
};

export default config;
