import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Settings,
  Notifications,
  Security,
  Storage,
  Save,
} from '@mui/icons-material';

const SettingsPage: React.FC = () => {
  const [gpsUpdateInterval, setGpsUpdateInterval] = useState('2000');
  const [gpsFailureRate, setGpsFailureRate] = useState('0.15');
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState('3');
  const [dataRetention, setDataRetention] = useState('30');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const handleSaveSettings = () => {
    // Aquí implementar la lógica para guardar configuraciones
    console.log('Guardando configuraciones...');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Configuración del Sistema
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Ajustes generales del sistema de monitoreo de flotas
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Configuraciones principales */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Configuración GPS */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                  Configuración GPS
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Intervalo de Actualización (ms)"
                  value={gpsUpdateInterval}
                  onChange={(e) => setGpsUpdateInterval(e.target.value)}
                  type="number"
                  fullWidth
                  helperText="Frecuencia de actualización de ubicaciones GPS"
                />
                
                <TextField
                  label="Tasa de Fallos Simulada"
                  value={gpsFailureRate}
                  onChange={(e) => setGpsFailureRate(e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 1 }}
                  fullWidth
                  helperText="Porcentaje de fallos GPS simulados (0.0 - 1.0)"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Precisión Mínima</InputLabel>
                  <Select
                    value="10"
                    label="Precisión Mínima"
                  >
                    <MenuItem value="5">5 metros</MenuItem>
                    <MenuItem value="10">10 metros</MenuItem>
                    <MenuItem value="20">20 metros</MenuItem>
                    <MenuItem value="50">50 metros</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Configuración Circuit Breaker */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security sx={{ mr: 2, color: 'warning.main' }} />
                <Typography variant="h6">
                  Circuit Breaker
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Umbral de Fallos"
                  value={circuitBreakerThreshold}
                  onChange={(e) => setCircuitBreakerThreshold(e.target.value)}
                  type="number"
                  fullWidth
                  helperText="Número de fallos antes de abrir el circuit breaker"
                />
                
                <TextField
                  label="Timeout (ms)"
                  value="30000"
                  type="number"
                  fullWidth
                  helperText="Tiempo antes de intentar cerrar el circuit breaker"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={debugMode}
                      onChange={(e) => setDebugMode(e.target.checked)}
                    />
                  }
                  label="Modo Debug"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Configuración de Base de Datos */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Storage sx={{ mr: 2, color: 'info.main' }} />
                <Typography variant="h6">
                  Base de Datos
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Retención de Datos (días)"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  type="number"
                  fullWidth
                  helperText="Días que se conservan los datos históricos"
                />
                
                <TextField
                  label="TTL Redis (ms)"
                  value="300000"
                  type="number"
                  fullWidth
                  helperText="Tiempo de vida de datos en cache Redis"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                    />
                  }
                  label="Backup Automático"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Panel lateral */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Notificaciones */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications sx={{ mr: 2, color: 'secondary.main' }} />
                <Typography variant="h6">
                  Notificaciones
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                  }
                  label="Notificaciones Habilitadas"
                />
                
                <Divider />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Alertas GPS"
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Alertas de Ruta"
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="Alertas de Sistema"
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Circuit Breaker"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Estado del Sistema */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado del Sistema
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success">
                  Servicios funcionando correctamente
                </Alert>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Versión: 1.0.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Última actualización: 20/07/2024
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: 99.5%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones del Sistema
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  fullWidth
                >
                  Guardar Configuración
                </Button>
                
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                >
                  Reiniciar Servicios
                </Button>
                
                <Button
                  variant="outlined"
                  color="info"
                  fullWidth
                >
                  Exportar Configuración
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                >
                  Reset a Defaults
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
