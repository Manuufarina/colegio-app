import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Box, IconButton, Tooltip, LinearProgress
} from '@mui/material';
import { Visibility, Warning } from '@mui/icons-material';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import Loading from '../layout/Loading';
import { getCalificacionesByAlumno } from '../../services/calificacionService';

const AlumnosRiesgoList = () => {
  const navigate = useNavigate();
  const { alumnos, getAlumnos } = useContext(AlumnoContext);
  const [alumnosRiesgo, setAlumnosRiesgo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlumnos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (alumnos.length === 0) return;
    const calcularRiesgo = async () => {
      setLoading(true);
      const resultados = [];
      for (const alumno of alumnos) {
        try {
          const calificaciones = await getCalificacionesByAlumno(alumno.id);
          if (calificaciones.length === 0) continue;
          const promedio = calificaciones.reduce((sum, c) => sum + (c.nota || 0), 0) / calificaciones.length;
          const materiasDesaprobadas = {};
          calificaciones.forEach(c => {
            const key = c.materiaNombre || c.materiaId;
            if (!materiasDesaprobadas[key]) materiasDesaprobadas[key] = [];
            materiasDesaprobadas[key].push(c.nota || 0);
          });
          const materiasBajas = Object.entries(materiasDesaprobadas)
            .filter(([, notas]) => {
              const avg = notas.reduce((a, b) => a + b, 0) / notas.length;
              return avg < 6;
            })
            .map(([materia]) => materia);

          if (promedio < 6 || materiasBajas.length > 0) {
            resultados.push({
              ...alumno,
              promedio: Math.round(promedio * 100) / 100,
              materiasBajas,
              totalCalificaciones: calificaciones.length
            });
          }
        } catch (error) {
          console.error(`Error calculando riesgo para alumno ${alumno.id}:`, error);
        }
      }
      resultados.sort((a, b) => a.promedio - b.promedio);
      setAlumnosRiesgo(resultados);
      setLoading(false);
    };
    calcularRiesgo();
  }, [alumnos]);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Warning color="error" sx={{ fontSize: 36 }} />
        <Typography variant="h4">Alumnos en Riesgo Academico</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Alumnos con promedio inferior a 6 o materias desaprobadas
      </Typography>

      {alumnosRiesgo.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            No hay alumnos en situacion de riesgo academico
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'error.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Alumno</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Promedio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Materias Desaprobadas</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Calificaciones</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnosRiesgo.map((alumno) => (
                <TableRow key={alumno.id} hover>
                  <TableCell>
                    <Typography fontWeight="bold">{alumno.apellido}, {alumno.nombre}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={alumno.promedio * 10}
                        color={alumno.promedio < 4 ? 'error' : 'warning'}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography fontWeight="bold" color={alumno.promedio < 4 ? 'error.main' : 'warning.main'}>
                        {alumno.promedio}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {alumno.materiasBajas.map((m, i) => (
                        <Chip key={i} label={m} size="small" color="error" variant="outlined" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{alumno.totalCalificaciones}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver estadisticas">
                      <IconButton color="primary" onClick={() => navigate('/estadisticas/alumno')}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AlumnosRiesgoList;
