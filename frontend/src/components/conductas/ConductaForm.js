import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConductaContext from '../../context/conductas/ConductaContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Paper,
  Grid
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ConductaForm = () => {
  const navigate = useNavigate();
  const conductaContext = useContext(ConductaContext);
  const alumnoContext = useContext(AlumnoContext);
  const alertContext = useContext(AlertContext);

  const { addConducta } = conductaContext;
  const { alumnos, getAlumnos, loading } = alumnoContext;
  const { setAlert } = alertContext;

  const [conducta, setConducta] = useState({
    alumnoId: '',
    tipo: '',
    descripcion: '',
    puntos: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const { alumnoId, tipo, descripcion, puntos, fecha, observaciones } = conducta;

  useEffect(() => {
    getAlumnos();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    setConducta({ ...conducta, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!alumnoId || !tipo || !descripcion || !puntos || !fecha) {
      setAlert('Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    if (puntos < 1 || puntos > 10) {
      setAlert('Los puntos deben estar entre 1 y 10', 'error');
      return;
    }

    try {
      await addConducta({
        ...conducta,
        puntos: Number(puntos)
      });
      setAlert('Conducta registrada exitosamente', 'success');
      navigate('/conductas');
    } catch (error) {
      setAlert('Error al registrar la conducta', 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/conductas')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          Nueva Conducta
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Alumno"
                name="alumnoId"
                value={alumnoId}
                onChange={onChange}
                required
              >
                <MenuItem value="">
                  <em>Seleccionar alumno</em>
                </MenuItem>
                {alumnos && alumnos.map((alumno) => (
                  <MenuItem key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo"
                name="tipo"
                value={tipo}
                onChange={onChange}
                required
              >
                <MenuItem value="">
                  <em>Seleccionar tipo</em>
                </MenuItem>
                <MenuItem value="positiva">Positiva</MenuItem>
                <MenuItem value="negativa">Negativa</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripcion"
                name="descripcion"
                value={descripcion}
                onChange={onChange}
                required
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puntos (1-10)"
                name="puntos"
                type="number"
                value={puntos}
                onChange={onChange}
                required
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                type="date"
                value={fecha}
                onChange={onChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones"
                name="observaciones"
                value={observaciones}
                onChange={onChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/conductas')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                >
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ConductaForm;
