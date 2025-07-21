# 🔧 Configuración de Ambiente - Fleet Monitoring Frontend

## 📋 Descripción

Este documento explica cómo configurar las variables de ambiente para conectar el frontend con el backend ASP.NET Core en diferentes entornos.

## 🚀 Configuración Rápida

### Backend ASP.NET Core (https://localhost:5001)

El sistema está configurado para conectarse automáticamente al backend ASP.NET Core que corre en `https://localhost:5001`.

### Variables de Ambiente

#### `.env` (Base)
```bash
# Backend ASP.NET Core Configuration
REACT_APP_API_BASE_URL=https://localhost:5001
REACT_APP_GEOLOCATION_SERVICE_URL=https://localhost:5001
REACT_APP_ROUTING_SERVICE_URL=https://localhost:5001
REACT_APP_AUDIT_SERVICE_URL=https://localhost:5001

# SignalR WebSocket Configuration
REACT_APP_WEBSOCKET_URL=wss://localhost:5001/ws
```

#### `.env.development` (Desarrollo)
```bash
# ASP.NET Core Backend
REACT_APP_API_BASE_URL=https://localhost:5001

# Development Settings
REACT_APP_ENV=development
REACT_APP_LOG_LEVEL=debug
HTTPS=true
NODE_TLS_REJECT_UNAUTHORIZED=0  # Para certificados autofirmados
```

#### `.env.production` (Producción)
```bash
# Production URLs (ACTUALIZAR PARA PRODUCCIÓN)
REACT_APP_API_BASE_URL=https://your-production-domain.com/api

# Production Settings
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=warn
GENERATE_SOURCEMAP=false
```

## 🔑 Variables de Ambiente Detalladas

| Variable | Descripción | Desarrollo | Producción |
|----------|-------------|------------|------------|
| `REACT_APP_API_BASE_URL` | URL base del backend | `https://localhost:5001` | `https://tu-dominio.com/api` |
| `REACT_APP_WEBSOCKET_URL` | URL para SignalR/WebSockets | `wss://localhost:5001/hubs/monitoring` | `wss://tu-dominio.com/hubs/monitoring` |
| `REACT_APP_ENV` | Ambiente de ejecución | `development` | `production` |
| `REACT_APP_LOG_LEVEL` | Nivel de logging | `debug` | `warn` |
| `HTTPS` | Habilitar HTTPS local | `true` | N/A |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Aceptar certificados autofirmados | `0` (permitir) | N/A |

## 🏃‍♂️ Comandos de Ejecución

### Desarrollo
```bash
# Usar configuración de desarrollo (.env.development)
npm start

# O con configuración personalizada
REACT_APP_API_BASE_URL=https://localhost:5001 npm start
```

### Producción
```bash
# Build para producción (.env.production)
npm run build

# Preview del build
npm install -g serve
serve -s build
```

## 🔒 HTTPS y Certificados Autofirmados

### Problema Común
Si ves errores como:
- `NET::ERR_CERT_AUTHORITY_INVALID`
- `SSL certificate problem`
- `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

### Soluciones:

1. **Configuración Automática** (Ya incluida):
   ```env
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

2. **Confiar en el Certificado del Backend**:
   - Navega a `https://localhost:5001` en tu navegador
   - Acepta el certificado autofirmado
   - Marca "Confiar en este certificado"

3. **Certificado Personalizado**:
   ```env
   HTTPS=true
   SSL_CRT_FILE=path/to/certificate.crt
   SSL_KEY_FILE=path/to/private.key
   ```

## 🛠️ Endpoints del Backend

### Controladores ASP.NET Core
- **Alerts**: `GET/POST https://localhost:5001/api/alerts`
- **Vehicles**: `GET/DELETE https://localhost:5001/api/vehicles`
- **Geolocation**: `POST https://localhost:5001/api/geolocation`
- **Routes**: `GET/POST/PUT/DELETE https://localhost:5001/api/routes`
- **Routing**: `POST https://localhost:5001/api/routing/calculate`

### SignalR Hubs
- **Monitoring**: `wss://localhost:5001/hubs/monitoring`

## 🐛 Resolución de Problemas

### Error: "Network Error" o "ECONNREFUSED"
```bash
# Verificar que el backend esté corriendo
curl -k https://localhost:5001/api/health

# O verificar en el navegador
https://localhost:5001/swagger
```

### Error: "Cannot resolve module '@/config'"
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
npm start
```

### CORS Issues
Verificar que el backend ASP.NET Core tenga configurado CORS:
```csharp
// En Startup.cs o Program.cs
app.UseCors(builder => builder
    .WithOrigins("http://localhost:3000", "https://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
```

## 📊 Monitoreo y Logs

### Logs de Desarrollo
Con `REACT_APP_LOG_LEVEL=debug` verás:
- 🚀 Requests HTTP
- ✅ Responses exitosas  
- ❌ Errores de API
- ⚡ Events de WebSocket

### Logs de Producción
Con `REACT_APP_LOG_LEVEL=warn` solo verás:
- ⚠️ Warnings
- ❌ Errores críticos

## 🚀 Validación de Configuración

El sistema valida automáticamente la configuración al iniciar:

```javascript
import { validateEnvironmentConfig } from './src/config/environment';

// Validación automática
if (!validateEnvironmentConfig()) {
  throw new Error('Invalid environment configuration');
}
```

## 📝 Archivos de Configuración

```
fleet-monitoring-frontend/
├── .env                    # Base
├── .env.development        # Desarrollo
├── .env.production         # Producción
├── src/config/
│   └── environment.ts      # Manager de configuración
└── src/constants/
    └── index.ts           # Constantes usando config
```

## ✅ Lista de Verificación

- [ ] Backend ASP.NET Core corriendo en `https://localhost:5001`
- [ ] Variables de ambiente configuradas correctamente
- [ ] Certificado HTTPS aceptado en el navegador
- [ ] CORS configurado en el backend
- [ ] Frontend iniciado con `npm start`
- [ ] API calls funcionando (verificar DevTools > Network)

¡Listo! Tu frontend debería conectarse correctamente al backend ASP.NET Core. 🎉
