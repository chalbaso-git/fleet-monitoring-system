# Fleet Monitoring System - Frontend

Sistema de monitoreo de flotas con GPS en tiempo real desarrollado con React y TypeScript.

## 🚀 Características

### Módulos Principales
- **🗺️ Geolocalización**: Rastreo de vehículos en tiempo real con GPS
- **🛣️ Ruteo**: Optimización de rutas con algoritmo A* simplificado  
- **📊 Auditoría**: Histórico de rutas y alertas del sistema
- **🔍 Monitoreo**: Sistema de salud y Circuit Breaker

### Tecnologías Utilizadas
- **React 18** con TypeScript
- **Material-UI** para componentes de UI
- **React Query** para manejo de estado servidor
- **React Router** para navegación
- **Leaflet** para mapas interactivos
- **Socket.io** para comunicación en tiempo real
- **Recharts** para gráficos y métricas
- **Axios** para peticiones HTTP

## 📋 Requisitos Previos

- Node.js 16.x o superior
- npm 8.x o superior
- Backend services ejecutándose (Geolocalización, Ruteo, Auditoría)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd fleet-monitoring-system/fleet-monitoring-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con las URLs de los servicios backend
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── common/          # Componentes reutilizables
│   ├── geolocation/     # Módulo de geolocalización
│   ├── routing/         # Módulo de ruteo
│   ├── audit/           # Módulo de auditoría
│   └── monitoring/      # Módulo de monitoreo
├── pages/               # Páginas principales
├── services/            # Servicios API
├── hooks/               # Custom hooks
├── types/               # Tipos TypeScript
├── utils/               # Utilidades
├── contexts/            # Context providers
└── constants/           # Constantes del sistema
```

## 🏃‍♂️ Scripts Disponibles

### Desarrollo
- `npm start` - Ejecutar en modo desarrollo
- `npm run start:prod` - Ejecutar con configuración de producción

### Testing
- `npm test` - Ejecutar tests en modo watch
- `npm run test:coverage` - Ejecutar tests con cobertura
- `npm run test:ci` - Ejecutar tests para CI/CD

### Build y Deployment
- `npm run build` - Crear build de producción
- `npm run build:analyze` - Analizar tamaño del bundle

### Calidad de Código
- `npm run lint` - Ejecutar ESLint
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Verificar tipos TypeScript

## 🔧 Configuración

### Variables de Entorno

```env
# API Endpoints
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_GEOLOCATION_SERVICE_URL=http://localhost:8081
REACT_APP_ROUTING_SERVICE_URL=http://localhost:8082
REACT_APP_AUDIT_SERVICE_URL=http://localhost:8083

# WebSocket
REACT_APP_WEBSOCKET_URL=ws://localhost:8084

# GPS Mock
REACT_APP_GPS_UPDATE_INTERVAL=2000
REACT_APP_GPS_FAILURE_RATE=0.15

# Mapas
REACT_APP_MAP_DEFAULT_CENTER_LAT=4.570868
REACT_APP_MAP_DEFAULT_CENTER_LNG=-74.297333
REACT_APP_MAP_DEFAULT_ZOOM=10
```

## 🔌 Integración con Backend

### Servicios Requeridos
1. **Servicio de Geolocalización** (Puerto 8081)
   - Recepción de datos GPS
   - Almacenamiento en Redis (TTL: 5 min)
   - Prevención de duplicados

2. **Servicio de Ruteo** (Puerto 8082)
   - Cálculo de rutas óptimas
   - Manejo de deadlocks
   - Algoritmo A* simplificado

3. **Servicio de Auditoría** (Puerto 8083)
   - Registro histórico en PostgreSQL
   - Auditoría de cambios
   - Generación de reportes

### WebSocket Events
- `VEHICLE_LOCATION_UPDATE` - Actualización de ubicación
- `ALERT_UPDATE` - Nueva alerta del sistema
- `SYSTEM_HEALTH_UPDATE` - Estado de servicios

## 📊 Características del Sistema

- **Monitoreo en tiempo real** de 5 vehículos simulados
- **Circuit Breaker** con 15% de fallos aleatorios
- **Cobertura de pruebas ≥90%**
- **Pipeline CI/CD** con SonarQube
- **Transacciones distribuidas** (PostgreSQL + Redis)

## 🔄 Estados del Sistema

### Vehículos
- `active` - Vehículo activo y enviando datos
- `inactive` - Vehículo inactivo temporalmente
- `maintenance` - Vehículo en mantenimiento
- `offline` - Sin conexión GPS

### Rutas
- `planned` - Ruta planificada
- `active` - Ruta en ejecución
- `completed` - Ruta completada
- `cancelled` - Ruta cancelada

### Alertas
- `low` - Información general
- `medium` - Advertencia
- `high` - Error importante
- `critical` - Error crítico del sistema

## 🚨 Sistema de Alertas

### Tipos de Alertas
- `gps_failure` - Fallo en GPS del vehículo
- `route_deviation` - Desviación de ruta planificada
- `circuit_breaker` - Circuit breaker activado
- `network_error` - Error de conectividad
- `system_error` - Error interno del sistema

## 📈 Monitoreo y Métricas

### Circuit Breaker
- Monitoreo automático de fallos
- Recuperación gradual
- Métricas de disponibilidad

### Métricas del Sistema
- Tiempo de respuesta de APIs
- Tasa de errores
- Uptime de servicios
- Latencia de WebSocket

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear issue en GitHub
- Contactar al equipo de desarrollo
