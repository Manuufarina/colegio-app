import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box, Chip
} from '@mui/material';
import { Add, Edit, Delete, People } from '@mui/icons-material';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const CursoList = () => {
  const navigate = useNavigate();
  const { cursos, loading, getCursos, deleteCurso } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => { getCursos(); /* eslint-disable-next-line */ }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar este curso?')) {
      await deleteCurso(id);
      setAlert('Curso eliminado', 'success');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Cursos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/cursos/nuevo')}>
          Nuevo Curso
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ano</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Division</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Turno</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nivel</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No hay cursos registrados</TableCell></TableRow>
            ) : cursos.map((curso) => (
              <TableRow key={curso.id} hover>
                <TableCell>{curso.anio}°</TableCell>
                <TableCell>{curso.division}</TableCell>
                <TableCell><Chip label={curso.turno || 'Manana'} size="small" /></TableCell>
                <TableCell>{curso.nivel || 'Secundario'}</TableCell>
                <TableCell align="center">
                  <IconButton color="info" onClick={() => navigate(`/cursos/${curso.id}/alumnos`)}><People /></IconButton>
                  <IconButton color="primary" onClick={() => navigate(`/cursos/editar/${curso.id}`)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(curso.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CursoList;
