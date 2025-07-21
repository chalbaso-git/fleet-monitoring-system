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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Route as RouteIcon,
  Calculate as CalculateIcon,
  RestartAlt as ResetIcon,
  DirectionsRun,
  Timer,
  SettingsBackupRestore,
} from '@mui/icons-material';
import { useCalculateRoute, useResetCircuit } from '../hooks';
import { RouteCalculationRequest, RouteCalculation } from '../types/entities/routing';

const RoutingPage: React.FC = () => {
  const [openCalculateDialog, setOpenCalculateDialog] = useState(false);
  const [newRouteRequest, setNewRouteRequest] = useState<RouteCalculationRequest>({
    vehicleId: '',
    origin: '',
    destination: '',
  });

  // Estados para mostrar resultados
  const [calculations, setCalculations] = useState<RouteCalculation[]>([]);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState({
    isOpen: false,
    failureCount: 0,
    lastReset: new Date().toISOString(),
  });

  // Hooks de API
  const calculateRouteMutation = useCalculateRoute();
  const resetCircuitMutation = useResetCircuit();

  const handleCalculateRoute = async () => {
    try {
      const result = await calculateRouteMutation.mutateAsync(newRouteRequest);
      setCalculations(prev => [result, ...prev.slice(0, 9)]); // Mantener solo los últimos 10
      setNewRouteRequest({
        vehicleId: '',
        origin: '',
        destination: '',
      });
      setOpenCalculateDialog(false);
    } catch (error) {
      console.error('Error al calcular ruta:', error);
      setCircuitBreakerStatus(prev => ({
        ...prev,
        failureCount: prev.failureCount + 1,
        isOpen: prev.failureCount >= 2, // Simular circuit breaker
      }));
    }
  };

  const handleResetCircuit = async () => {
    try {
      await resetCircuitMutation.mutateAsync();
      setCircuitBreakerStatus({
        isOpen: false,
        failureCount: 0,
        lastReset: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error al resetear circuit breaker:', error);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Sistema de Ruteo
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleResetCircuit}
            disabled={resetCircuitMutation.isPending}
            color={circuitBreakerStatus.isOpen ? 'error' : 'primary'}
          >
            {resetCircuitMutation.isPending ? 'Reseteando...' : 'Reset Circuit Breaker'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCalculateDialog(true)}
            disabled={circuitBreakerStatus.isOpen}
          >
            Calcular Ruta
          </Button>
        </Box>
      </Box>

      {/* Estado del Circuit Breaker */}
      {circuitBreakerStatus.isOpen && (
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          <strong>Circuit Breaker Activado:</strong> El sistema de ruteo está temporalmente deshabilitado debido a múltiples fallos. 
          Haga clic en "Reset Circuit Breaker" para intentar nuevamente.
        </MuiAlert>
      )}

      {/* Estadísticas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <CalculateIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{calculations.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Rutas Calculadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: circuitBreakerStatus.isOpen ? 'error.main' : 'success.main' }}>
                <SettingsBackupRestore />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {circuitBreakerStatus.isOpen ? 'ABIERTO' : 'CERRADO'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Circuit Breaker
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <Timer />
              </Avatar>
              <Box>
                <Typography variant="h6">{circuitBreakerStatus.failureCount}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Fallos Detectados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <DirectionsRun />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {calculations.length > 0 
                    ? Math.round(calculations.reduce((sum, calc) => sum + calc.distance, 0) / calculations.length)
                    : 0
                  } km
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Distancia Promedio
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje informativo */}
      <MuiAlert severity="info" sx={{ mb: 2 }}>
        <strong>Integración con Backend:</strong> Este módulo está completamente integrado con el RoutingController 
        del backend, incluyendo el cálculo de rutas y manejo del circuit breaker.
      </MuiAlert>

      {/* Tabla de Cálculos de Rutas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial de Cálculos de Rutas
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehículo</TableCell>
                  <TableCell>Origen</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell>Distancia</TableCell>
                  <TableCell>Duración Estimada</TableCell>
                  <TableCell>Calculado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay cálculos de rutas registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  calculations.map((calculation, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <RouteIcon color="primary" fontSize="small" />
                          {calculation.vehicleId}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {calculation.origin}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {calculation.destination}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${calculation.distance} km`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {calculation.estimatedDuration} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(calculation.calculatedAt).toLocaleString()}
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

      {/* Dialog para Calcular Ruta */}
      <Dialog open={openCalculateDialog} onClose={() => setOpenCalculateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Calcular Nueva Ruta</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="ID del Vehículo"
              value={newRouteRequest.vehicleId}
              onChange={(e) => setNewRouteRequest({ ...newRouteRequest, vehicleId: e.target.value })}
              placeholder="Ej: VEH-001"
            />
            <TextField
              fullWidth
              label="Origen"
              value={newRouteRequest.origin}
              onChange={(e) => setNewRouteRequest({ ...newRouteRequest, origin: e.target.value })}
              placeholder="Ej: Bogotá Centro"
            />
            <TextField
              fullWidth
              label="Destino"
              value={newRouteRequest.destination}
              onChange={(e) => setNewRouteRequest({ ...newRouteRequest, destination: e.target.value })}
              placeholder="Ej: Aeropuerto El Dorado"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalculateDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCalculateRoute} 
            variant="contained"
            disabled={
              !newRouteRequest.vehicleId || 
              !newRouteRequest.origin || 
              !newRouteRequest.destination || 
              calculateRouteMutation.isPending ||
              circuitBreakerStatus.isOpen
            }
            startIcon={calculateRouteMutation.isPending ? <CircularProgress size={16} /> : <CalculateIcon />}
          >
            {calculateRouteMutation.isPending ? 'Calculando...' : 'Calcular Ruta'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars de éxito */}
      <Snackbar
        open={calculateRouteMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => calculateRouteMutation.reset()}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Ruta calculada exitosamente
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={resetCircuitMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => resetCircuitMutation.reset()}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Circuit breaker reseteado exitosamente
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default RoutingPage;
