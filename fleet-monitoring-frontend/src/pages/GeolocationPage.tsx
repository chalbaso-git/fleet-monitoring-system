import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Alert as MuiAlert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn,
  GpsFixed,
  Refresh,
} from '@mui/icons-material';
import { useStoreCoordinate } from '../hooks';
import { GpsCoordinate } from '../types/entities/geolocation';

const GeolocationPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCoordinate, setNewCoordinate] = useState<GpsCoordinate>({
    vehicleId: '',
    latitude: 0,
    longitude: 0,
    timestamp: '',
  });

  // Hook para almacenar coordenada
  const storeCoordinateMutation = useStoreCoordinate();

  // Datos mock para ubicaciones recientes
  const [recentLocations] = useState<GpsCoordinate[]>([
    {
      vehicleId: 'VEH-001',
      latitude: 4.570868,
      longitude: -74.297333,
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      vehicleId: 'VEH-002',
      latitude: 4.628594,
      longitude: -74.064910,
      timestamp: '2024-01-15T10:25:00Z',
    },
    {
      vehicleId: 'VEH-003',
      latitude: 4.518716,
      longitude: -74.247894,
      timestamp: '2024-01-15T10:20:00Z',
    },
  ]);

  const handleStoreCoordinate = async () => {
    try {
      const coordinateToStore = {
        ...newCoordinate,
        timestamp: newCoordinate.timestamp || new Date().toISOString(),
      };
      
      await storeCoordinateMutation.mutateAsync(coordinateToStore);
      setNewCoordinate({
        vehicleId: '',
        latitude: 0,
        longitude: 0,
        timestamp: '',
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al almacenar coordenada:', error);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewCoordinate({
            ...newCoordinate,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Geolocalización GPS
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Registrar Ubicación
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <LocationOn />
              </Avatar>
              <Box>
                <Typography variant="h6">{recentLocations.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Ubicaciones Registradas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <GpsFixed />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {recentLocations.filter(loc => 
                    new Date(loc.timestamp) > new Date(Date.now() - 5 * 60 * 1000)
                  ).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Activas (últimos 5 min)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <LocationOn />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {new Set(recentLocations.map(loc => loc.vehicleId)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vehículos Rastreados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje informativo */}
      <MuiAlert severity="info" sx={{ mb: 2 }}>
        <strong>Integración con Backend:</strong> La funcionalidad de almacenar coordenadas GPS está completamente integrada con el GeolocationController del backend.
      </MuiAlert>

      {/* Tabla de Ubicaciones Recientes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ubicaciones Recientes
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehículo ID</TableCell>
                  <TableCell>Latitud</TableCell>
                  <TableCell>Longitud</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentLocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay ubicaciones registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLocations.map((location) => (
                    <TableRow key={`${location.vehicleId}-${location.timestamp}`}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <GpsFixed color="primary" fontSize="small" />
                          {location.vehicleId}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {location.latitude.toFixed(6)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {location.longitude.toFixed(6)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(location.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={
                            new Date(location.timestamp) > new Date(Date.now() - 5 * 60 * 1000)
                              ? 'success.main'
                              : 'text.secondary'
                          }
                        >
                          {new Date(location.timestamp) > new Date(Date.now() - 5 * 60 * 1000)
                            ? 'Reciente'
                            : 'Histórico'
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para Nueva Coordenada */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Nueva Ubicación GPS</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="ID del Vehículo"
              value={newCoordinate.vehicleId}
              onChange={(e) => setNewCoordinate({ ...newCoordinate, vehicleId: e.target.value })}
              placeholder="Ej: VEH-001"
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Latitud"
                type="number"
                value={newCoordinate.latitude || ''}
                onChange={(e) => setNewCoordinate({ ...newCoordinate, latitude: parseFloat(e.target.value) || 0 })}
                inputProps={{ step: 0.000001 }}
              />
              <TextField
                fullWidth
                label="Longitud"
                type="number"
                value={newCoordinate.longitude || ''}
                onChange={(e) => setNewCoordinate({ ...newCoordinate, longitude: parseFloat(e.target.value) || 0 })}
                inputProps={{ step: 0.000001 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Timestamp (opcional)"
              type="datetime-local"
              value={newCoordinate.timestamp ? newCoordinate.timestamp.slice(0, 16) : ''}
              onChange={(e) => setNewCoordinate({ ...newCoordinate, timestamp: e.target.value ? new Date(e.target.value).toISOString() : '' })}
              helperText="Si se deja vacío, se usará la fecha y hora actual"
            />
            <Button
              variant="outlined"
              startIcon={<GpsFixed />}
              onClick={handleCurrentLocation}
              fullWidth
            >
              Usar Mi Ubicación Actual
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleStoreCoordinate} 
            variant="contained"
            disabled={!newCoordinate.vehicleId || !newCoordinate.latitude || !newCoordinate.longitude || storeCoordinateMutation.isPending}
            startIcon={storeCoordinateMutation.isPending ? <CircularProgress size={16} /> : <LocationOn />}
          >
            {storeCoordinateMutation.isPending ? 'Guardando...' : 'Guardar Ubicación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={storeCoordinateMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => storeCoordinateMutation.reset()}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Coordenada GPS almacenada exitosamente
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default GeolocationPage;
