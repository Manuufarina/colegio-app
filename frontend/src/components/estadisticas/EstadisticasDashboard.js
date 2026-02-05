import React, { useContext, useEffect } from 'react';
import EstadisticaContext from '../../context/estadisticas/EstadisticaContext';
import Loading from '../layout/Loading';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2', '#0097a7', '#c2185b', '#512da8'];

const EstadisticasDashboard = () => {
  const estadisticaContext = useContext(EstadisticaContext);
  const { estadisticas, getEstadisticas, loading } = estadisticaContext;

  useEffect(() => {
    getEstadisticas();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;

  const totalAlumnos = estadisticas ? estadisticas.totalAlumnos || 0 : 0;
  const totalCursos = estadisticas ? estadisticas.totalCursos || 0 : 0;
  const alumnosPorCurso = estadisticas ? estadisticas.alumnosPorCurso || [] : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Estadisticas
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" component="div">
                    {totalAlumnos}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Alumnos
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" component="div">
                    {totalCursos}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Cursos
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Alumnos por Curso
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={alumnosPorCurso}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#1976d2" name="Alumnos" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Distribucion por Curso
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={alumnosPorCurso}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                >
                  {alumnosPorCurso.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EstadisticasDashboard;
