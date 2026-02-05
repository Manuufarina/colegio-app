import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box,
  FormControl, InputLabel, Select, MenuItem, Grid, Chip, TextField
} from '@mui/material';
import { Save } from '@mui/icons-material';
import AsistenciaContext from '../../context/asistencias/AsistenciaContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const AsistenciaPage = () => {
  const { asistencias, loading, getAsistenciasByCurso, addAsistenciaMasiva } = useContext(AsistenciaContext);
  const { alumnos, getAlumnosByCurso } = useContext(AlumnoContext);
  const { cursos, getCursos } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  const [cursoId, setCursoId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [registros, setRegistros] = useState({});

  useEffect(() => { getCursos(); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    if (cursoId) {
      getAlumnosByCurso(cursoId);
      getAsistenciasByCurso(cursoId, fecha);
    }
    // eslint-disable-next-line
  }, [cursoId, fecha]);

  useEffect(() => {
    const map = {};
    asistencias.forEach(a => { map[a.alumnoId] = a.estado; });
    alumnos.forEach(a => { if (!map[a.id]) map[a.id] = 'presente'; });
    setRegistros(map);
  }, [asistencias, alumnos]);

  const handleChange = (alumnoId, estado) => {
    setRegistros({ ...registros, [alumnoId]: estado });
  };

  const handleSave = async () => {
    const data = alumnos.map(a => ({
      alumnoId: a.id, alumnoNombre: `${a.apellido}, ${a.nombre}`,
      cursoId, fecha, estado: registros[a.id] || 'presente'
    }));
    await addAsistenciaMasiva(data);
    setAlert('Asistencia registrada', 'success');
  };

  const getColor = (estado) => {
    switch (estado) {
      case 'presente': return 'success';
      case 'ausente': return 'error';
      case 'tarde': return 'warning';
      case 'justificado': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>Asistencias</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Curso</InputLabel>
            <Select value={cursoId} label="Curso" onChange={(e) => setCursoId(e.target.value)}>
              {cursos.map(c => <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
      </Grid>
      {!cursoId ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Seleccione un curso</Typography></Paper>
      ) : loading ? <Loading /> : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Alumno</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.length === 0 ? (
                  <TableRow><TableCell colSpan={2} align="center">No hay alumnos en este curso</TableCell></TableRow>
                ) : alumnos.map((alumno) => (
                  <TableRow key={alumno.id} hover>
                    <TableCell>{alumno.apellido}, {alumno.nombre}</TableCell>
                    <TableCell align="center">
                      {['presente', 'ausente', 'tarde', 'justificado'].map(estado => (
                        <Chip
                          key={estado} label={estado.charAt(0).toUpperCase() + estado.slice(1)}
                          color={registros[alumno.id] === estado ? getColor(estado) : 'default'}
                          variant={registros[alumno.id] === estado ? 'filled' : 'outlined'}
                          onClick={() => handleChange(alumno.id, estado)}
                          sx={{ mx: 0.5 }}
                        />
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<Save />} size="large" onClick={handleSave}>
              Guardar Asistencia
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default AsistenciaPage;
