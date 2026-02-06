import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import MateriaContext from '../../context/materias/MateriaContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const MateriaList = () => {
  const navigate = useNavigate();
  const { materias, loading, getMaterias, deleteMateria } = useContext(MateriaContext);
  const { setAlert } = useContext(AlertContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getMaterias(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar esta materia?')) {
      await deleteMateria(id);
      setAlert('Materia eliminada', 'success');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Materias</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/materias/nuevo')}>Nueva Materia</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Curso</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Profesor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materias.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">No hay materias registradas</TableCell></TableRow>
            ) : materias.map((materia) => (
              <TableRow key={materia.id} hover>
                <TableCell>{materia.nombre}</TableCell>
                <TableCell>{materia.cursoNombre || '-'}</TableCell>
                <TableCell>{materia.profesorNombre || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/materias/editar/${materia.id}`)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(materia.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MateriaList;
