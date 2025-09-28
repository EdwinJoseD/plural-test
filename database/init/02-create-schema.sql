-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Crear esquema específico si no existe
CREATE SCHEMA IF NOT EXISTS plural_schema;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON SCHEMA plural_schema TO plural_user;

-- Establecer search_path por defecto para el usuario
ALTER USER plural_user SET search_path = plural_schema, public;

-- Otorgar permisos en la base de datos
GRANT CREATE ON DATABASE postgres TO plural_user;

-- Establecer permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA plural_schema GRANT ALL ON TABLES TO plural_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA plural_schema GRANT ALL ON SEQUENCES TO plural_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA plural_schema GRANT ALL ON FUNCTIONS TO plural_user;