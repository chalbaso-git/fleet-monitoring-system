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
  Search as SearchIcon,
  Refresh as RefreshIcon,
  DirectionsRun,
  Timeline,
} from '@mui/icons-material';
import { useRoutes, useRoutesByVehicleAndDate, useAddRoute } from '../hooks';
import { Route } from '../types/entities/route';

const RoutesPage: React.FC = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [newRoute, setNewRoute] = useState<Omit<Route, 'id'>>({
    vehicleId: '',
    path: '',
    distance: 0,
    calculatedAt: '',
  });
  
  const [searchParams, setSearchParams] = useState({
    vehicleId: '',
    date: '',
  });

  // Hooks de API
  const { data: routes = [], isLoading, error, refetch } = useRoutes();
  const addRouteMutation = useAddRoute();
  const { 
    data: filteredRoutes = [], 
    isLoading: isLoadingFiltered,
    refetch: refetchFiltered 
  } = useRoutesByVehicleAndDate(
    searchParams.vehicleId, 
    searchParams.date
  );

  const [showingFiltered, setShowingFiltered] = useState(false);

  const handleAddRoute = async () => {
    try {
      const routeToAdd = {
        ...newRoute,
        calculatedAt: newRoute.calculatedAt || new Date().toISOString(),
      };
      
      await addRouteMutation.mutateAsync(routeToAdd);
      setNewRoute({
        vehicleId: '',
        path: '',
        distance: 0,
        calculatedAt: '',
      });
      setOpenAddDialog(false);
      refetch();
    } catch (error) {
      console.error('Error al crear ruta:', error);
    }
  };

  const handleSearch = async () => {
    if (searchParams.vehicleId && searchParams.date) {
      await refetchFiltered();
      setShowingFiltered(true);
      setOpenSearchDialog(false);
    }
  };

  const handleShowAllRoutes = () => {
    setShowingFiltered(false);
    refetch();
  };

  const displayRoutes = showingFiltered ? filteredRoutes : routes;
  const displayLoading = showingFiltered ? isLoadingFiltered : isLoading;

  const totalDistance = displayRoutes.reduce((sum, route) => sum + route.distance, 0);
  const averageDistance = displayRoutes.length > 0 ? totalDistance / displayRoutes.length : 0;

  if (error) {
    return (
      <Box p={3}>
        <MuiAlert severity="error">
          Error al cargar las rutas: {error.message}
        </MuiAlert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Rutas
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={displayLoading}
          >
            Actualizar
          </Button>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => setOpenSearchDialog(true)}
          >
            Buscar por Vehículo y Fecha
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
          >
            Nueva Ruta
          </Button>
        </Box>
      </Box>

      {/* Filtro activo */}
      {showingFiltered && (
        <MuiAlert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleShowAllRoutes}>
              Mostrar Todas
            </Button>
          }
        >
          <strong>Filtro Activo:</strong> Vehículo {searchParams.vehicleId} - Fecha {searchParams.date}
        </MuiAlert>
      )}

      {/* Estadísticas */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <RouteIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{displayRoutes.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {showingFiltered ? 'Rutas Filtradas' : 'Total de Rutas'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <DirectionsRun />
              </Avatar>
              <Box>
                <Typography variant="h6">{totalDistance.toFixed(1)} km</Typography>
                <Typography variant="body2" color="textSecondary">
                  Distancia Total
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Timeline />
              </Avatar>
              <Box>
                <Typography variant="h6">{averageDistance.toFixed(1)} km</Typography>
                <Typography variant="body2" color="textSecondary">
                  Distancia Promedio
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <RouteIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {new Set(displayRoutes.map(route => route.vehicleId)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vehículos con Rutas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje informativo */}
      <MuiAlert severity="info" sx={{ mb: 2 }}>
        <strong>Integración con Backend:</strong> Este módulo está completamente integrado con el RouteController 
        del backend para crear, listar y buscar rutas por vehículo y fecha.
      </MuiAlert>

      {/* Tabla de Rutas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {showingFiltered ? 'Rutas Filtradas' : 'Todas las Rutas'}
          </Typography>
          
          {displayLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Vehículo</TableCell>
                    <TableCell>Ruta (Path)</TableCell>
                    <TableCell>Distancia</TableCell>
                    <TableCell>Calculado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          {showingFiltered ? 'No se encontraron rutas con los filtros aplicados' : 'No hay rutas registradas'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {route.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <RouteIcon color="primary" fontSize="small" />
                            {route.vehicleId}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 300, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={route.path}
                          >
                            {route.path}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${route.distance} km`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(route.calculatedAt).toLocaleString()}
                          </Typography>
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

      {/* Dialog para Nueva Ruta */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nueva Ruta</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="ID del Vehículo"
              value={newRoute.vehicleId}
              onChange={(e) => setNewRoute({ ...newRoute, vehicleId: e.target.value })}
              placeholder="Ej: VEH-001"
            />
            <TextField
              fullWidth
              label="Ruta (Path)"
              value={newRoute.path}
              onChange={(e) => setNewRoute({ ...newRoute, path: e.target.value })}
              placeholder="Ej: Bogotá -> Soacha -> Bogotá"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Distancia (km)"
              type="number"
              value={newRoute.distance || ''}
              onChange={(e) => setNewRoute({ ...newRoute, distance: parseFloat(e.target.value) || 0 })}
              inputProps={{ min: 0, step: 0.1 }}
            />
            <TextField
              fullWidth
              label="Fecha de Cálculo (opcional)"
              type="datetime-local"
              value={newRoute.calculatedAt ? newRoute.calculatedAt.slice(0, 16) : ''}
              onChange={(e) => setNewRoute({ 
                ...newRoute, 
                calculatedAt: e.target.value ? new Date(e.target.value).toISOString() : '' 
              })}
              helperText="Si se deja vacío, se usará la fecha y hora actual"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddRoute} 
            variant="contained"
            disabled={
              !newRoute.vehicleId || 
              !newRoute.path || 
              !newRoute.distance || 
              addRouteMutation.isPending
            }
            startIcon={addRouteMutation.isPending ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {addRouteMutation.isPending ? 'Guardando...' : 'Guardar Ruta'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Búsqueda */}
      <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Buscar Rutas por Vehículo y Fecha</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              fullWidth
              label="ID del Vehículo"
              value={searchParams.vehicleId}
              onChange={(e) => setSearchParams({ ...searchParams, vehicleId: e.target.value })}
              placeholder="Ej: VEH-001"
            />
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSearch} 
            variant="contained"
            disabled={!searchParams.vehicleId || !searchParams.date || isLoadingFiltered}
            startIcon={isLoadingFiltered ? <CircularProgress size={16} /> : <SearchIcon />}
          >
            {isLoadingFiltered ? 'Buscando...' : 'Buscar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={addRouteMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => addRouteMutation.reset()}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Ruta agregada exitosamente
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default RoutesPage;
