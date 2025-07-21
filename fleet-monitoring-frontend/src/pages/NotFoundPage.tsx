import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Home, Error } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
        <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La página que buscas no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/dashboard')}
          size="large"
        >
          Volver al Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
