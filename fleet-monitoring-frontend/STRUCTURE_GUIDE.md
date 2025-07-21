# 📁 Estructura Organizada del Proyecto

## ✅ Nueva Organización Implementada

La estructura del proyecto ha sido reorganizada en subcarpetas para mejorar la mantenibilidad y escalabilidad:

### 📂 Estructura de Carpetas

```
src/
├── types/
│   ├── entities/        # Entidades principales del dominio
│   │   └── alert.ts     # Entidad Alert
│   ├── requests/        # Tipos para requests API
│   │   └── alert.ts     # Requests de Alert
│   ├── responses/       # Tipos para responses API
│   │   └── alert.ts     # Responses de Alert
│   ├── enums/           # Enumeraciones del sistema
│   │   └── index.ts     # Todos los enums (AlertType, VehicleStatus, etc.)
│   ├── common.ts        # Tipos base comunes (BaseEntity, ApiResponse, etc.)
│   └── api.ts          # Exports centralizados para API types
│
├── services/
│   ├── api/             # Servicios para llamadas HTTP
│   │   ├── client.ts    # Cliente Axios base con interceptors
│   │   └── alertService.ts # Servicio específico para Alert API
│   ├── websocket/       # Servicios WebSocket (preparado)
│   └── index.ts         # Exports centralizados
│
├── hooks/
│   ├── api/             # Hooks de React Query para APIs
│   │   └── useAlerts.ts # Hooks para Alert API
│   ├── websocket/       # Hooks para WebSocket (preparado)
│   └── index.ts         # Exports centralizados
│
└── utils/               # Utilidades organizadas
    ├── dateUtils.ts     # Funciones para fechas
    ├── geoUtils.ts      # Funciones de geolocalización
    ├── commonUtils.ts   # Funciones comunes
    └── index.ts         # Exports centralizados
```

## 🎯 Beneficios de la Nueva Estructura

### 1. **Separación Clara de Responsabilidades**
- **Entities**: Solo las entidades de dominio
- **Requests/Responses**: Tipos específicos para API
- **Enums**: Constantes tipadas centralizadas
- **Services/API**: Lógica de comunicación HTTP
- **Hooks/API**: Estado y mutaciones de React Query

### 2. **Escalabilidad**
- Fácil agregar nuevos controllers (Vehicle, Route, Audit, etc.)
- Cada módulo tiene su propio namespace
- Imports más específicos y claros

### 3. **Mantenibilidad**
- Archivos más pequeños y enfocados
- Fácil localización de código
- Menos conflictos en Git

### 4. **TypeScript Mejorado**
- Path mapping configurado (`@/types/entities/*`)
- Auto-completado más preciso
- Mejor detección de errores

## 📋 Cómo Usar la Nueva Estructura

### Importar Tipos
```typescript
// Específico por categoría
import { Alert } from '@/types/entities/alert';
import { CreateAlertRequest } from '@/types/requests/alert';
import { AlertFilters } from '@/types/responses/alert';
import { AlertType, AlertSeverity } from '@/types/enums';

// O todo junto desde api.ts
import { Alert, CreateAlertRequest, AlertType } from '@/types/api';
```

### Usar Servicios
```typescript
// Importar servicio específico
import { AlertApiService } from '@/services/api/alertService';

// O desde el índice general
import { AlertApiService } from '@/services';
```

### Usar Hooks
```typescript
// Hooks específicos
import { useAlerts, useAddAlert } from '@/hooks/api/useAlerts';

// O desde el índice
import { useAlerts, useAddAlert } from '@/hooks';
```

## 🚀 Preparado para Expansión

Esta estructura está lista para recibir los próximos 4 controllers:

### Próximos Módulos a Agregar:
1. **Vehicle** → `types/entities/vehicle.ts`, `services/api/vehicleService.ts`, etc.
2. **Route** → `types/entities/route.ts`, `services/api/routeService.ts`, etc.
3. **Geolocation** → `types/entities/geoLocation.ts`, etc.
4. **Audit** → `types/entities/audit.ts`, etc.
5. **Monitoring** → Para sistema health y circuit breaker

Cada nuevo controller seguirá el mismo patrón organizativo, manteniendo consistencia en toda la aplicación.

## ✨ Features Implementadas

- ✅ **Cliente HTTP Base** con interceptors y logging
- ✅ **Manejo de Errores** estandarizado  
- ✅ **React Query** configurado con invalidation
- ✅ **TypeScript estricto** con tipos bien definidos
- ✅ **Path mapping** completo
- ✅ **Exports centralizados** para fácil importación

¡La base está sólida y lista para continuar con los siguientes controllers!
