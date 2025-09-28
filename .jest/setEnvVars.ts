const variableTest = () => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3000';
  process.env.JWT_SECRET = 'test';
  process.env.PREFIX = '/test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_USER = 'sdf';
  process.env.DB_PASSWORD = 'dsgfsdfdsfsdf';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'dfsf-core';
  process.env.DB_SCHEMA = 'sdfsfewe';
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
};
module.exports = variableTest;
