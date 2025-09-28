# Prueba Tecnica Backend NodeJs Plurall

Aplicación Node.js con PostgreSQL, Redis y herramientas de desarrollo containerizada con Docker.

## 🚀 Tecnologías

- **Backend**: Node.js
- **Base de datos**: PostgreSQL 15
- **Caché**: Redis 7
- **Containerización**: Docker & Docker Compose
- **Administración DB**: pgAdmin 4
- **Administración Redis**: Redis Commander

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://docs.docker.com/get-docker/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone ttps://github.com/EdwinJoseD/plural-test.git
cd plural-test
```

### 2. Estructura de archivos requerida

Asegúrate de tener la siguiente estructura de archivos y carpetas:

```
.
├── docker-compose.yml
├── DockerFile.dev
├── database/
│   ├── init/          # Scripts de inicialización de BD
│   └── backups/       # Carpeta para backups
├── redis/
│   └── redis.conf     # Configuración de Redis
└── src/               # Código fuente de la aplicación
```

### 3. Configurar archivos de configuración

#### Redis (redis/redis.conf)

Crea el archivo de configuración de Redis si no existe:

```bash
mkdir -p redis
touch redis/redis.conf
```

#### Scripts de inicialización de PostgreSQL (opcional)

Si tienes scripts SQL de inicialización, colócalos en `database/init/`:

```bash
mkdir -p database/init database/backups
```

## 🚀 Ejecución del Proyecto

### Iniciar todos los servicios

```bash
docker-compose up -d
```

### Ver logs de los servicios

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Verificar estado de los servicios

```bash
docker-compose ps
```

## 🌐 Acceso a los Servicios

Una vez que los contenedores estén ejecutándose, podrás acceder a:

| Servicio                 | URL                   | Credenciales                                         |
| ------------------------ | --------------------- | ---------------------------------------------------- |
| **Aplicación Principal** | http://localhost:3000 | -                                                    |
| **pgAdmin**              | http://localhost:5050 | Email: `admin@localhost.com`<br>Password: `admin123` |
| **Redis Commander**      | http://localhost:8081 | User: `admin`<br>Password: `admin123`                |

### Configuración de pgAdmin

1. Accede a http://localhost:5050
2. Inicia sesión con las credenciales mencionadas
3. Agrega un nuevo servidor con estos datos:
   - **Name**: Plural DB
   - **Host**: `postgres`
   - **Port**: `5432`
   - **Database**: `plural_db`
   - **Username**: `plural_user`
   - **Password**: `plural_password`

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Reconstruir y iniciar los servicios
docker-compose up --build -d

# Acceder al contenedor de la aplicación
docker-compose exec app bash

# Acceder a PostgreSQL
docker-compose exec postgres psql -U plural_user -d plural_db

# Acceder a Redis CLI
docker-compose exec redis redis-cli
```

### Comandos NPM del Proyecto

```bash
# Desarrollo
npm run dev                 # Iniciar en modo desarrollo con nodemon
npm run build:watch         # Compilar TypeScript en modo watch
npm run type-check          # Verificar tipos sin generar archivos

# Construcción
npm run build               # Compilar TypeScript a JavaScript
npm run clean               # Limpiar carpeta dist
npm run prepare             # Preparar para producción (ejecuta build)

# Ejecución
npm start                   # Ejecutar aplicación compilada
npm run start:prod          # Ejecutar en modo producción

# Testing
npm test                    # Ejecutar tests
npm run test:watch          # Ejecutar tests en modo watch
npm run test:coverage       # Ejecutar tests con reporte de cobertura

# Calidad de código
npm run lint                # Verificar código con ESLint
npm run lint:fix            # Corregir errores automáticos de ESLint
npm run format              # Formatear código con Prettier
```

### Comandos dentro del contenedor

```bash
# Acceder al contenedor y ejecutar comandos npm
docker-compose exec app npm run test
docker-compose exec app npm run lint
docker-compose exec app npm run build

# Instalar nuevas dependencias
docker-compose exec app npm install <package-name>
docker-compose exec app npm install --save-dev <dev-package>

# Ver logs en tiempo real durante desarrollo
docker-compose exec app tail -f logs/app.log
```

### Gestión de datos

```bash
# Crear backup de la base de datos
docker-compose exec postgres pg_dump -U plural_user plural_db > ./database/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -i postgres psql -U plural_user -d plural_db < ./database/backups/backup_file.sql
```

### Limpieza

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ CUIDADO: Elimina todos los datos)
docker-compose down -v

# Limpiar imágenes sin usar
docker image prune -f
```

## 📊 Puertos Utilizados

| Puerto | Servicio        | Descripción                 |
| ------ | --------------- | --------------------------- |
| 3000   | App             | Aplicación Node.js          |
| 9229   | App             | Puerto de debugging         |
| 5433   | PostgreSQL      | Base de datos (externo)     |
| 5432   | PostgreSQL      | Base de datos (interno)     |
| 6379   | Redis           | Caché/Sesiones              |
| 5050   | pgAdmin         | Administrador de PostgreSQL |
| 8081   | Redis Commander | Administrador de Redis      |

## 🗂️ Volúmenes Persistentes

Los siguientes datos se mantienen entre reinicios:

- `postgres_data`: Datos de PostgreSQL
- `redis_data`: Datos de Redis
- `pgadmin_data`: Configuración de pgAdmin
- `app-data`: Datos de la aplicación
- `app-logs`: Logs de la aplicación
- `app-uploads`: Archivos subidos

## ⚙️ Variables de Entorno

### Aplicación (app)

| Variable      | Valor               | Descripción                |
| ------------- | ------------------- | -------------------------- |
| `NODE_ENV`    | `development`       | Entorno de ejecución       |
| `PORT`        | `3000`              | Puerto de la aplicación    |
| `DB_HOST`     | `postgres`          | Host de PostgreSQL         |
| `DB_PORT`     | `5432`              | Puerto de PostgreSQL       |
| `DB_NAME`     | `plural_db`         | Nombre de la base de datos |
| `DB_USER`     | `plural_user`       | Usuario de PostgreSQL      |
| `DB_PASSWORD` | `plural_password`   | Contraseña de PostgreSQL   |
| `DB_SCHEMA`   | `plural_schema`     | Schema de PostgreSQL       |
| `REDIS_HOST`  | `redis`             | Host de Redis              |
| `REDIS_PORT`  | `6379`              | Puerto de Redis            |
| `JWT_SECRET`  | `mi_jwt_secret_dev` | Secret para JWT            |

## 🔍 Solución de Problemas

### Los servicios no inician correctamente

1. Verifica que Docker esté ejecutándose
2. Comprueba que los puertos no estén en uso:
   ```bash
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5433
   ```

### Error de conexión a la base de datos

1. Espera a que PostgreSQL esté completamente iniciado
2. Verifica los logs:
   ```bash
   docker-compose logs postgres
   ```

### La aplicación no recarga automáticamente

1. Asegúrate de que el volumen del código fuente esté montado correctamente
2. Verifica que `npm run dev` esté configurado para hot reload

### Limpiar y reiniciar completamente

```bash
docker-compose down -v
docker-compose up --build -d
```

## 📝 Notas de Desarrollo

- Se partio desde cero para la contruccion de la aplicacion, cambiando arquitectuta, implmentando clean code y DDD
- El código fuente se monta como volumen para hot reload
- Los `node_modules` están excluidos del montaje para mejor rendimiento
- El debugging está habilitado en el puerto 9229
- Los healthchecks aseguran que los servicios estén listos antes de iniciar dependencias

## 🤖 Desarrollo Asistido por IA

Este proyecto fue desarrollado con el apoyo de herramientas de inteligencia artificial para optimizar el proceso de desarrollo:

### Herramientas Utilizadas

- **GitHub Copilot**: Para autocompletado de código, generación de funciones y refactoring desde el editor
- **Claude AI**: Para resolución de dudas sobre infraestructura, optimización de queries y solución de problemas complejos

### Problemas Resueltos con IA

#### 1. Problema N+1 en Query Builder

**Problema identificado**: Queries innecesarias al cargar relaciones anidadas causando degradación de performance.

**Mitigación aplicada**:

- Implementación de `eager loading` con `include` en lugar de queries separadas
- Uso de `batch loading` para relaciones múltiples
- Optimización de queries con `select` específicos para evitar over-fetching

```javascript
// ❌ Problema N+1 - Genera múltiples queries
const users = await User.findAll();
for (const user of users) {
  const posts = await user.getPosts(); // N queries adicionales
}

// ✅ Solución optimizada
const users = await User.findAll({
  include: [
    {
      model: Post,
      attributes: ['id', 'title', 'createdAt'],
    },
  ],
});
```

#### 2. Optimización de Conexiones a Base de Datos

**Problema**: Pool de conexiones mal configurado causando timeouts.

**Solución**: Configuración optimizada del pool con retry logic y health checks.

### Ejemplo de Prompt para Claude

Cuando te encuentres con problemas similares, puedes usar prompts como este:

```
Tengo un problema de performance en mi API Node.js con Sequelize.
Estoy obteniendo usuarios y sus posts relacionados, pero noto que
se están ejecutando múltiples queries (problema N+1).

Contexto:
- Modelo User con relación hasMany a Posts
- Necesito mostrar últimos 5 posts por usuario
- La consulta debe ser eficiente para 100+ usuarios

¿Podrías ayudarme a optimizar esta query y explicar las
mejores prácticas para evitar el problema N+1?

[Código actual aquí]
```

### Mejores Prácticas para Desarrollo con IA

1. **Sé específico**: Proporciona contexto claro del problema y el stack tecnológico
2. **Incluye código**: Comparte el código problemático para obtener soluciones precisas
3. **Define restricciones**: Menciona limitaciones de performance, memoria o compatibilidad
4. **Pide explicaciones**: No solo solicites la solución, sino también el razonamiento
5. **Valida las respuestas**: Siempre prueba y entiende las soluciones propuestas

### Recursos de IA Recomendados

- **Para código**: GitHub Copilot, Cursor AI
- **Para arquitectura**: Claude, ChatGPT-4
- **Para debugging**: Stack Overflow Copilot, Claude
- **Para documentación**: Claude, Notion AI
