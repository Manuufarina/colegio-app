import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Box, InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const AlumnoList = () => {
  const navigate = useNavigate();
  const { alumnos, filtered, loading, getAlumnos, deleteAlumno, filterAlumnos, clearFilter } = useContext(AlumnoContext);
  const { setAlert } = useContext(AlertContext);
  const [search, setSearch] = useState('');

  useEffect(() => { getAlumnos(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { search ? filterAlumnos(search) : clearFilter(); /* eslint-disable-next-line */ }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar este alumno?')) {
      await deleteAlumno(id);
      setAlert('Alumno eliminado', 'success');
    }
  };

  if (loading) return <Loading />;

  const list = filtered || alumnos;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alumnos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/alumnos/nuevo')}>
          Nuevo Alumno
        </Button>
      </Box>
      <TextField
        fullWidth placeholder="Buscar por nombre, apellido o documento..." sx={{ mb: 3 }}
        value={search} onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
      />
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Curso</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No hay alumnos registrados</TableCell></TableRow>
            ) : list.map((alumno) => (
              <TableRow key={alumno.id} hover>
                <TableCell>{alumno.apellido}</TableCell>
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.documento}</TableCell>
                <TableCell>{alumno.cursoNombre || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/alumnos/editar/${alumno.id}`)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(alumno.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AlumnoList;
