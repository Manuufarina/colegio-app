import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box, Chip
} from '@mui/material';
import { ArrowBack, Edit, Delete, Add } from '@mui/icons-material';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const AlumnosCurso = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { alumnos, loading, getAlumnosByCurso, deleteAlumno } = useContext(AlumnoContext);
  const { getCurso, curso } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    getCurso(cursoId);
    getAlumnosByCurso(cursoId);
    // eslint-disable-next-line
  }, [cursoId]);

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar este alumno del curso?')) {
      await deleteAlumno(id);
      setAlert('Alumno eliminado', 'success');
      getAlumnosByCurso(cursoId);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/cursos')} sx={{ mr: 2 }}>
          Volver a Cursos
        </Button>
        <Typography variant="h4">
          Alumnos de {curso ? `${curso.anio}° ${curso.division}` : 'Curso'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip label={`${alumnos.length} alumno${alumnos.length !== 1 ? 's' : ''}`} color="primary" />
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/alumnos/nuevo')}>
          Agregar Alumno
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No hay alumnos en este curso</TableCell></TableRow>
            ) : alumnos.map((alumno) => (
              <TableRow key={alumno.id} hover>
                <TableCell>{alumno.apellido}</TableCell>
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.documento || '-'}</TableCell>
                <TableCell>{alumno.email || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/alumnos/editar/${alumno.id}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(alumno.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AlumnosCurso;
