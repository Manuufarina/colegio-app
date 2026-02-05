import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Button, Chip, Divider, Grid
} from '@mui/material';
import { ArrowBack, ThumbUp, Warning } from '@mui/icons-material';
import Loading from '../layout/Loading';
import { getConducta } from '../../services/conductaService';

const ConductaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conducta, setConducta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConducta = async () => {
      try {
        const data = await getConducta(id);
        setConducta(data);
      } catch (error) {
        console.error('Error cargando conducta:', error);
      }
      setLoading(false);
    };
    loadConducta();
  }, [id]);

  if (loading) return <Loading />;
  if (!conducta) return <Container><Typography>Conducta no encontrada</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Volver</Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {conducta.tipo === 'positiva' ? <ThumbUp color="success" sx={{ fontSize: 40 }} /> : <Warning color="error" sx={{ fontSize: 40 }} />}
          <Box>
            <Typography variant="h5">Registro de Conducta</Typography>
            <Chip
              label={conducta.tipo === 'positiva' ? 'Positiva' : 'Negativa'}
              color={conducta.tipo === 'positiva' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary" variant="body2">Fecha</Typography>
            <Typography variant="body1">{conducta.fecha ? new Date(conducta.fecha).toLocaleDateString() : '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary" variant="body2">Puntos</Typography>
            <Typography variant="h6" color={conducta.tipo === 'positiva' ? 'success.main' : 'error.main'}>
              {conducta.tipo === 'positiva' ? '+' : '-'}{conducta.puntos}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="text.secondary" variant="body2">Descripcion</Typography>
            <Typography variant="body1">{conducta.descripcion}</Typography>
          </Grid>
          {conducta.observaciones && (
            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2">Observaciones</Typography>
              <Typography variant="body1">{conducta.observaciones}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ConductaDetail;
