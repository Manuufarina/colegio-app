import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BoletinContext from '../../context/boletines/BoletinContext';
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
  MenuItem,
  TextField
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const BoletinAlumno = () => {
  const { alumnoId } = useParams();
  const boletinContext = useContext(BoletinContext);
  const { boletin, getBoletinAlumno, loading } = boletinContext;

  const [periodo, setPeriodo] = useState('1er Trimestre');

  useEffect(() => {
    getBoletinAlumno(alumnoId, periodo);
    // eslint-disable-next-line
  }, [alumnoId, periodo]);

  const handlePrint = () => {
    window.print();
  };

  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Boletin del Alumno
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            select
            label="Periodo"
            value={periodo}
            onChange={handlePeriodoChange}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="1er Trimestre">1er Trimestre</MenuItem>
            <MenuItem value="2do Trimestre">2do Trimestre</MenuItem>
            <MenuItem value="3er Trimestre">3er Trimestre</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </Box>
      </Box>

      {boletin && (
        <Box mb={3}>
          <Typography variant="h6">
            Alumno: {boletin.alumnoNombre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Curso: {boletin.curso} | Periodo: {periodo}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Materia</strong></TableCell>
              <TableCell align="center"><strong>Nota</strong></TableCell>
              <TableCell><strong>Periodo</strong></TableCell>
              <TableCell><strong>Observaciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boletin && boletin.calificaciones && boletin.calificaciones.length > 0 ? (
              boletin.calificaciones.map((calificacion, index) => (
                <TableRow key={index} hover>
                  <TableCell>{calificacion.materia}</TableCell>
                  <TableCell align="center">{calificacion.nota}</TableCell>
                  <TableCell>{calificacion.periodo}</TableCell>
                  <TableCell>{calificacion.observaciones}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No hay calificaciones para este periodo
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

export default BoletinAlumno;
