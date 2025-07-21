import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  Timeline,
  Assessment,
} from '@mui/icons-material';

const AnalyticsPage: React.FC = () => {
  const metrics = [
    {
      title: 'Eficiencia de Combustible',
      value: '12.5 L/100km',
      trend: '+5.2%',
      icon: <Speed />,
      color: 'success.main',
    },
    {
      title: 'Tiempo de Inactividad',
      value: '2.3 hrs',
      trend: '-8.1%',
      icon: <Timeline />,
      color: 'warning.main',
    },
    {
      title: 'Rutas Completadas',
      value: '234',
      trend: '+12.4%',
      icon: <Assessment />,
      color: 'info.main',
    },
    {
      title: 'Satisfacción de Entrega',
      value: '94.2%',
      trend: '+2.1%',
      icon: <TrendingUp />,
      color: 'primary.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Analíticas y Reportes
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Métricas de rendimiento y análisis de la flota
      </Typography>

      {/* Métricas principales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: metric.color, mr: 2 }}>
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.title}
                  </Typography>
                  <Typography variant="caption" color={metric.trend.startsWith('+') ? 'success.main' : 'error.main'}>
                    {metric.trend} vs mes anterior
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Gráficos placeholder */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tendencia de Consumo de Combustible
          </Typography>
          <Box
            sx={{
              height: 300,
              bgcolor: 'grey.100',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="body2" color="grey.500">
              Gráfico de líneas con Recharts
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Distribución de Rutas por Estado
          </Typography>
          <Box
            sx={{
              height: 300,
              bgcolor: 'grey.100',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="body2" color="grey.500">
              Gráfico de pastel con Recharts
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
