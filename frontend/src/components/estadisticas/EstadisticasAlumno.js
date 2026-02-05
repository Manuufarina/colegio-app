import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Box, Grid, MenuItem, TextField,
  Card, CardContent, Chip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import Loading from '../layout/Loading';
import { getCalificacionesByAlumno } from '../../services/calificacionService';
import { getConductasByAlumno } from '../../services/conductaService';

const EstadisticasAlumno = () => {
  const { alumnos, getAlumnos } = useContext(AlumnoContext);
  const [alumnoId, setAlumnoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => { getAlumnos(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    if (!alumnoId) return;
    const loadStats = async () => {
      setLoading(true);
      try {
        const [calificaciones, conductaData] = await Promise.all([
          getCalificacionesByAlumno(alumnoId),
          getConductasByAlumno(alumnoId)
        ]);

        const promedio = calificaciones.length > 0
          ? calificaciones.reduce((sum, c) => sum + (c.nota || 0), 0) / calificaciones.length
          : 0;

        const notasPorMateria = {};
        calificaciones.forEach(c => {
          const key = c.materiaNombre || c.materiaId;
          if (!notasPorMateria[key]) notasPorMateria[key] = [];
          notasPorMateria[key].push(c.nota || 0);
        });

        const promediosPorMateria = Object.entries(notasPorMateria).map(([materia, notas]) => ({
          materia,
          promedio: Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) / 100
        }));

        const notasPorPeriodo = {};
        calificaciones.forEach(c => {
          const p = c.periodo || 'Sin periodo';
          if (!notasPorPeriodo[p]) notasPorPeriodo[p] = [];
          notasPorPeriodo[p].push(c.nota || 0);
        });
        const rendimientoPorPeriodo = Object.entries(notasPorPeriodo).map(([periodo, notas]) => ({
          periodo,
          promedio: Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 100) / 100
        }));

        setStats({
          totalCalificaciones: calificaciones.length,
          promedio: Math.round(promedio * 100) / 100,
          promediosPorMateria,
          rendimientoPorPeriodo,
          conductas: conductaData.estadisticas
        });
      } catch (error) {
        console.error('Error cargando estadisticas:', error);
      }
      setLoading(false);
    };
    loadStats();
  }, [alumnoId]);

  const alumnoSeleccionado = alumnos.find(a => a.id === alumnoId);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>Estadisticas por Alumno</Typography>
      <TextField
        select label="Seleccionar Alumno" value={alumnoId}
        onChange={(e) => setAlumnoId(e.target.value)} sx={{ minWidth: 300, mb: 3 }}
      >
        <MenuItem value=""><em>Seleccionar</em></MenuItem>
        {alumnos.map(a => (
          <MenuItem key={a.id} value={a.id}>{a.apellido}, {a.nombre}</MenuItem>
        ))}
      </TextField>

      {alumnoId && (loading ? <Loading /> : stats && (
        <>
          {alumnoSeleccionado && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">
                {alumnoSeleccionado.apellido}, {alumnoSeleccionado.nombre}
              </Typography>
            </Box>
          )}

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Promedio General</Typography>
                  <Typography variant="h3" fontWeight="bold" color={stats.promedio >= 6 ? 'success.main' : 'error.main'}>
                    {stats.promedio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Calificaciones</Typography>
                  <Typography variant="h3" fontWeight="bold">{stats.totalCalificaciones}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Conductas</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={`+ ${stats.conductas?.positivas || 0}`} color="success" size="small" />
                    <Chip label={`- ${stats.conductas?.negativas || 0}`} color="error" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="text.secondary" variant="body2">Puntos Conducta</Typography>
                  <Typography variant="h3" fontWeight="bold" color={stats.conductas?.puntos >= 0 ? 'success.main' : 'error.main'}>
                    {stats.conductas?.puntos || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {stats.promediosPorMateria.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Promedio por Materia</Typography>
              <ResponsiveContainer width="100%" height={Math.max(250, stats.promediosPorMateria.length * 45)}>
                <BarChart data={stats.promediosPorMateria} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis type="category" dataKey="materia" width={90} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#1976d2">
                    {stats.promediosPorMateria.map((entry, i) => (
                      <Cell key={i} fill={entry.promedio >= 6 ? '#388e3c' : '#d32f2f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}

          {stats.rendimientoPorPeriodo.length > 0 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Rendimiento por Periodo</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.rendimientoPorPeriodo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#7b1fa2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </>
      ))}
    </Container>
  );
};

export default EstadisticasAlumno;
