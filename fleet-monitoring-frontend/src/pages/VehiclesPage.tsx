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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert as MuiAlert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DirectionsCar,
  LocationOn,
  Build as MaintenanceIcon,
  SignalWifiOff as OfflineIcon,
} from '@mui/icons-material';
import { useDeleteVehicle } from '../hooks';

// Datos mock para vehículos (hasta que tengamos un endpoint GET para vehículos)
interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
  lastLocation?: string;
  lastSeen?: string;
}

const VehiclesPage: React.FC = () => {
  // Estado para vehículos mock (reemplazar con useVehicles cuando esté disponible)
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'VEH-001',
      name: 'Camión de Reparto 1',
      licensePlate: 'ABC-123',
      model: 'Mercedes Sprinter',
      year: 2022,
      status: 'active',
      lastLocation: 'Bogotá Centro',
      lastSeen: '2024-01-15T10:30:00Z',
    },
    {
      id: 'VEH-002',
      name: 'Camión de Reparto 2',
      licensePlate: 'DEF-456',
      model: 'Ford Transit',
      year: 2021,
      status: 'maintenance',
      lastLocation: 'Zona Norte',
      lastSeen: '2024-01-15T08:45:00Z',
    },
    {
      id: 'VEH-003',
      name: 'Camión de Carga',
      licensePlate: 'GHI-789',
      model: 'Chevrolet NPR',
      year: 2023,
      status: 'active',
      lastLocation: 'Soacha',
      lastSeen: '2024-01-15T11:15:00Z',
    },
    {
      id: 'VEH-004',
      name: 'Van de Distribución',
      licensePlate: 'JKL-012',
      model: 'Renault Master',
      year: 2020,
      status: 'offline',
      lastLocation: 'Desconocida',
      lastSeen: '2024-01-14T16:20:00Z',
    },
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Hook para eliminar vehículo
  const deleteVehicleMutation = useDeleteVehicle();

  const handleDeleteClick = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      try {
        await deleteVehicleMutation.mutateAsync(vehicleToDelete);
        // Actualizar estado local (temporal hasta tener GET vehicles)
        setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete));
        setDeleteDialogOpen(false);
        setVehicleToDelete(null);
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <DirectionsCar color="success" />;
      case 'maintenance': return <MaintenanceIcon color="warning" />;
      case 'offline': return <OfflineIcon color="error" />;
      default: return <DirectionsCar />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'maintenance': return 'Mantenimiento';
      case 'offline': return 'Sin conexión';
      default: return status;
    }
  };

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const offlineVehicles = vehicles.filter(v => v.status === 'offline').length;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Vehículos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={true} // Deshabilitado hasta tener endpoint POST
        >
          Agregar Vehículo
        </Button>
      </Box>

      {/* Estadísticas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <DirectionsCar />
              </Avatar>
              <Box>
                <Typography variant="h6">{vehicles.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total de Vehículos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <DirectionsCar />
              </Avatar>
              <Box>
                <Typography variant="h6">{activeVehicles}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Activos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <MaintenanceIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{maintenanceVehicles}</Typography>
                <Typography variant="body2" color="textSecondary">
                  En Mantenimiento
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <OfflineIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{offlineVehicles}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Sin Conexión
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje informativo */}
      <MuiAlert severity="info" sx={{ mb: 2 }}>
        <strong>Integración con Backend:</strong> Solo la funcionalidad de eliminar vehículos está conectada al backend. 
        Las demás funcionalidades están preparadas para cuando se implementen los endpoints correspondientes.
      </MuiAlert>

      {/* Tabla de Vehículos */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Vehículos
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehículo</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Última Ubicación</TableCell>
                  <TableCell>Última Conexión</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        {getStatusIcon(vehicle.status)}
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {vehicle.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {vehicle.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontFamily="monospace">
                        {vehicle.licensePlate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vehicle.model}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {vehicle.year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(vehicle.status)}
                        color={getStatusColor(vehicle.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">
                          {vehicle.lastLocation || 'Desconocida'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vehicle.lastSeen 
                          ? new Date(vehicle.lastSeen).toLocaleString()
                          : 'N/A'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(vehicle.id)}
                        size="small"
                        title="Eliminar vehículo"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteVehicleMutation.isPending}
            startIcon={deleteVehicleMutation.isPending ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleteVehicleMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiclesPage;
