import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

const ConductaList = () => {
  const navigate = useNavigate();
  const alumnoContext = useContext(AlumnoContext);
  const { alumnos, getAlumnos, loading } = alumnoContext;

  useEffect(() => {
    getAlumnos();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Conductas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/conductas/nuevo')}
        >
          Nueva Conducta
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Apellido</strong></TableCell>
              <TableCell><strong>Curso</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos && alumnos.length > 0 ? (
              alumnos.map((alumno) => (
                <TableRow key={alumno.id} hover>
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.apellido}</TableCell>
                  <TableCell>{alumno.curso}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver conductas">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/conductas/alumno/${alumno.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No hay alumnos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ConductaList;
