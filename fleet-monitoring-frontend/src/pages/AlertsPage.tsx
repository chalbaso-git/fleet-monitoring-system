import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert as MuiAlert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Warning,
  Error,
  Info,
  Notifications,
  Refresh,
} from '@mui/icons-material';
import { useAlerts, useAddAlert } from '../hooks';

// Tipo basado en AlertDto del backend
interface Alert {
  vehicleId: string;
  type: string;
  message: string;
}

const AlertsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlert, setNewAlert] = useState<Alert>({
    vehicleId: '',
    type: '',
    message: '',
  });

  // Usar los hooks de API
  const { data: alerts = [], isLoading, error, refetch } = useAlerts();
  const addAlertMutation = useAddAlert();

  const handleAddAlert = async () => {
    try {
      await addAlertMutation.mutateAsync(newAlert);
      setNewAlert({ vehicleId: '', type: '', message: '' });
      setOpenDialog(false);
      refetch(); // Recargar la lista después de agregar
    } catch (error) {
      console.error('Error al agregar alerta:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'info': return <Info color="info" />;
      default: return <Notifications />;
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <MuiAlert severity="error">
          Error al cargar las alertas: {error.message}
        </MuiAlert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" component="h1">
            Alertas del Sistema
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Actualizar
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nueva Alerta
        </Button>
      </Box>

      {/* Estadísticas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Notifications />
              </Avatar>
              <Box>
                <Typography variant="h6">{alerts.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total de Alertas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <Error />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {alerts.filter(alert => alert.type?.toLowerCase() === 'error').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Críticas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <Warning />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {alerts.filter(alert => alert.type?.toLowerCase() === 'warning').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Advertencias
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje informativo */}
      <MuiAlert severity="info" sx={{ mb: 2 }}>
        <strong>Integración con Backend:</strong> Este módulo está completamente integrado con el AlertController del backend para crear y listar alertas.
      </MuiAlert>

      {/* Tabla de Alertas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Listado de Alertas
          </Typography>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Vehículo ID</TableCell>
                    <TableCell>Mensaje</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No hay alertas registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    alerts.map((alert, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getAlertIcon(alert.type)}
                            <Chip
                              label={alert.type}
                              size="small"
                              color={getSeverityColor(alert.type) as any}
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{alert.vehicleId}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          <Chip
                            label="Activa"
                            color="default"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Nueva Alerta */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Nueva Alerta</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="ID del Vehículo"
              value={newAlert.vehicleId}
              onChange={(e) => setNewAlert({ ...newAlert, vehicleId: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo de Alerta</InputLabel>
              <Select
                value={newAlert.type}
                label="Tipo de Alerta"
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
              >
                <MenuItem value="info">Información</MenuItem>
                <MenuItem value="warning">Advertencia</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Mensaje"
              multiline
              rows={3}
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddAlert} 
            variant="contained"
            disabled={!newAlert.vehicleId || !newAlert.type || !newAlert.message || addAlertMutation.isPending}
          >
            {addAlertMutation.isPending ? 'Registrando...' : 'Registrar Alerta'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={addAlertMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => addAlertMutation.reset()}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Alerta registrada exitosamente
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AlertsPage;
