// src/database/connection.ts - Conexión a PostgreSQL con Sequelize
import { Sequelize } from 'sequelize';
import config from './config.sequelize';
import { logger } from '../logger/logger';

const env = (process.env.NODE_ENV || 'development') as keyof typeof config;
const dbConfig = config[env];

// Crear instancia de Sequelize
export const sequelize = new Sequelize(dbConfig);

// Función para conectar a la base de datos
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a PostgreSQL establecida correctamente');

    // Solo en desarrollo, sincronizar modelos
    if (env === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('🔄 Modelos sincronizados');
    }
  } catch (error) {
    logger.error('❌ Error conectando a PostgreSQL:', error);
    process.exit(1);
  }
};

// Función para cerrar la conexión
export const closeDB = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('🔒 Conexión cerrada');
  } catch (error) {
    logger.error('❌ Error cerrando conexión:', error);
  }
};

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});
