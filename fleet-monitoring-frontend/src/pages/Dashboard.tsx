import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  Route,
  Warning,
  TrendingUp,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: 'Vehículos Activos',
      value: '24',
      total: '30',
      icon: <DirectionsCar />,
      color: 'primary.main',
      percentage: 80,
    },
    {
      title: 'Ubicaciones Registradas',
      value: '1,234',
      subtitle: 'Hoy',
      icon: <LocationOn />,
      color: 'success.main',
      percentage: 95,
    },
    {
      title: 'Rutas Completadas',
      value: '18',
      subtitle: 'Esta semana',
      icon: <Route />,
      color: 'info.main',
      percentage: 72,
    },
    {
      title: 'Alertas Activas',
      value: '3',
      subtitle: 'Requieren atención',
      icon: <Warning />,
      color: 'warning.main',
      percentage: 10,
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      vehicle: 'VEH-001',
      type: 'GPS Failure',
      time: 'Hace 5 minutos',
      severity: 'high',
    },
    {
      id: 2,
      vehicle: 'VEH-003',
      type: 'Route Deviation',
      time: 'Hace 15 minutos',
      severity: 'medium',
    },
    {
      id: 3,
      vehicle: 'VEH-007',
      type: 'Speed Violation',
      time: 'Hace 1 hora',
      severity: 'low',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard del Sistema
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Vista general del estado de la flota y el sistema de monitoreo
      </Typography>

      {/* Estadísticas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                  {stat.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stat.value}
                    {stat.total && (
                      <Typography component="span" variant="body1" color="text.secondary">
                        /{stat.total}
                      </Typography>
                    )}
                  </Typography>
                  {stat.subtitle && (
                    <Typography variant="body2" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stat.percentage}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stat.percentage}% del objetivo
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Alertas Recientes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1, color: 'warning.main' }} />
            Alertas Recientes
          </Typography>
          <Box>
            {recentAlerts.map((alert) => (
              <Box
                key={alert.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: '1px solid',
                  borderBottomColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {alert.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vehículo: {alert.vehicle} • {alert.time}
                  </Typography>
                </Box>
                <Chip
                  label={alert.severity}
                  color={getSeverityColor(alert.severity) as any}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Estado del Sistema */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
            Estado del Sistema
          </Typography>
          <Box sx={{ space: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Servicio de Geolocalización</Typography>
                <Chip label="Activo" color="success" size="small" />
              </Box>
              <LinearProgress variant="determinate" value={98} color="success" />
              <Typography variant="caption" color="text.secondary">
                98% disponibilidad
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Servicio de Ruteo</Typography>
                <Chip label="Activo" color="success" size="small" />
              </Box>
              <LinearProgress variant="determinate" value={95} color="success" />
              <Typography variant="caption" color="text.secondary">
                95% disponibilidad
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Sistema de Alertas</Typography>
                <Chip label="Degradado" color="warning" size="small" />
              </Box>
              <LinearProgress variant="determinate" value={85} color="warning" />
              <Typography variant="caption" color="text.secondary">
                85% disponibilidad
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Base de Datos</Typography>
                <Chip label="Activo" color="success" size="small" />
              </Box>
              <LinearProgress variant="determinate" value={99} color="success" />
              <Typography variant="caption" color="text.secondary">
                99% disponibilidad
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
