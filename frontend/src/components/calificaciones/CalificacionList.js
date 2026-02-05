import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box,
  FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import CalificacionContext from '../../context/calificaciones/CalificacionContext';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const CalificacionList = () => {
  const navigate = useNavigate();
  const { calificaciones, loading, getCalificacionesByCurso, deleteCalificacion } = useContext(CalificacionContext);
  const { cursos, getCursos } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);
  const [cursoId, setCursoId] = useState('');
  const [periodo, setPeriodo] = useState('');

  useEffect(() => { getCursos(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { if (cursoId) getCalificacionesByCurso(cursoId, periodo); /* eslint-disable-next-line */ }, [cursoId, periodo]);

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar esta calificacion?')) {
      await deleteCalificacion(id);
      setAlert('Calificacion eliminada', 'success');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Calificaciones</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/calificaciones/nuevo')}>Nueva Calificacion</Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Curso</InputLabel>
            <Select value={cursoId} label="Seleccionar Curso" onChange={(e) => setCursoId(e.target.value)}>
              {cursos.map(c => <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Periodo</InputLabel>
            <Select value={periodo} label="Periodo" onChange={(e) => setPeriodo(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="1er Trimestre">1er Trimestre</MenuItem>
              <MenuItem value="2do Trimestre">2do Trimestre</MenuItem>
              <MenuItem value="3er Trimestre">3er Trimestre</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {!cursoId ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Seleccione un curso para ver las calificaciones</Typography></Paper>
      ) : loading ? <Loading /> : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Alumno</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Materia</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nota</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Periodo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calificaciones.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No hay calificaciones</TableCell></TableRow>
              ) : calificaciones.map((cal) => (
                <TableRow key={cal.id} hover>
                  <TableCell>{cal.alumnoNombre || '-'}</TableCell>
                  <TableCell>{cal.materiaNombre || '-'}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: (cal.nota || 0) >= 6 ? 'success.main' : 'error.main' }}>{cal.nota}</TableCell>
                  <TableCell>{cal.periodo}</TableCell>
                  <TableCell>{cal.fecha ? new Date(cal.fecha).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => navigate(`/calificaciones/editar/${cal.id}`)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cal.id)}><Delete /></IconButton>
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

export default CalificacionList;
