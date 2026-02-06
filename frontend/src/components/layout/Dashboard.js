import React, { useContext, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, CardActionArea,
  Typography, Box
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  CalendarMonth as CalendarIcon,
  BusinessCenter as BusinessCenterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import EstadisticaContext from '../../context/estadisticas/EstadisticaContext';
import Loading from './Loading';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { estadisticas, loading, getEstadisticasGenerales } = useContext(EstadisticaContext);
  const navigate = useNavigate();

  useEffect(() => {
    getEstadisticasGenerales();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { title: 'Alumnos', value: estadisticas?.totalAlumnos || 0, icon: <PeopleIcon sx={{ fontSize: 48 }} />, color: '#1976d2', path: '/alumnos' },
    { title: 'Cursos', value: estadisticas?.totalCursos || 0, icon: <SchoolIcon sx={{ fontSize: 48 }} />, color: '#388e3c', path: '/cursos' },
    { title: 'Materias', value: '-', icon: <MenuBookIcon sx={{ fontSize: 48 }} />, color: '#f57c00', path: '/materias' },
    { title: 'Eventos', value: '-', icon: <CalendarIcon sx={{ fontSize: 48 }} />, color: '#7b1fa2', path: '/eventos' },
    { title: 'Gestión integral', value: '5', icon: <BusinessCenterIcon sx={{ fontSize: 48 }} />, color: '#00897b', path: '/gestion-integral' },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 1 }}>
        Bienvenido, {user?.nombre || user?.email}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Panel de control del sistema de gestion escolar
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card elevation={3}>
              <CardActionArea onClick={() => navigate(card.path)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>{card.title}</Typography>
                      <Typography variant="h3" fontWeight="bold">{card.value}</Typography>
                    </Box>
                    <Box sx={{ color: card.color }}>{card.icon}</Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
