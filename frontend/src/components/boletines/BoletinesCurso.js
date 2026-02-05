import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursoContext from '../../context/cursos/CursoContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import Loading from '../layout/Loading';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box, MenuItem,
  TextField, IconButton, Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BoletinesCurso = () => {
  const navigate = useNavigate();
  const { cursos, getCursos, loading: loadingCursos } = useContext(CursoContext);
  const { alumnos, getAlumnosByCurso, loading: loadingAlumnos } = useContext(AlumnoContext);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  useEffect(() => {
    getCursos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (cursoSeleccionado) getAlumnosByCurso(cursoSeleccionado);
    // eslint-disable-next-line
  }, [cursoSeleccionado]);

  if (loadingCursos) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>Boletines por Curso</Typography>
      <Box mb={3}>
        <TextField
          select label="Seleccionar Curso" value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          sx={{ minWidth: 300 }}
        >
          <MenuItem value=""><em>Seleccionar un curso</em></MenuItem>
          {cursos.map((curso) => (
            <MenuItem key={curso.id} value={curso.id}>
              {curso.anio}° {curso.division} - {curso.turno || 'Manana'}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {cursoSeleccionado && (
        loadingAlumnos ? <Loading /> : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Documento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Boletin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center">No hay alumnos en este curso</TableCell></TableRow>
                ) : alumnos.map((alumno) => (
                  <TableRow key={alumno.id} hover>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.documento || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver boletin">
                        <IconButton color="primary" onClick={() => navigate(`/boletines/${alumno.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container>
  );
};

export default BoletinesCurso;
