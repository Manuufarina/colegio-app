import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursoContext from '../../context/cursos/CursoContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import Loading from '../layout/Loading';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  MenuItem,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BoletinesCurso = () => {
  const navigate = useNavigate();
  const cursoContext = useContext(CursoContext);
  const alumnoContext = useContext(AlumnoContext);

  const { cursos, getCursos, loading: loadingCursos } = cursoContext;
  const { alumnos, getAlumnos, loading: loadingAlumnos } = alumnoContext;

  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  useEffect(() => {
    getCursos();
    getAlumnos();
    // eslint-disable-next-line
  }, []);

  const alumnosFiltrados = cursoSeleccionado
    ? alumnos.filter((alumno) => alumno.curso === cursoSeleccionado || alumno.cursoId === cursoSeleccionado)
    : [];

  if (loadingCursos || loadingAlumnos) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Boletines por Curso
      </Typography>

      <Box mb={3}>
        <TextField
          select
          label="Seleccionar Curso"
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          sx={{ minWidth: 300 }}
        >
          <MenuItem value="">
            <em>Seleccionar un curso</em>
          </MenuItem>
          {cursos && cursos.map((curso) => (
            <MenuItem key={curso.id} value={curso.id}>
              {curso.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {cursoSeleccionado && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Apellido</strong></TableCell>
                <TableCell align="center"><strong>Ver Boletin</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnosFiltrados.length > 0 ? (
                alumnosFiltrados.map((alumno) => (
                  <TableRow key={alumno.id} hover>
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver boletin">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/boletines/${alumno.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No hay alumnos en este curso
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default BoletinesCurso;
