import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid, MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import AlertContext from '../../context/alert/AlertContext';
import { addConducta } from '../../services/conductaService';

const SancionForm = () => {
  const navigate = useNavigate();
  const { alumnos, getAlumnos } = useContext(AlumnoContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    alumnoId: '',
    tipo: 'negativa',
    descripcion: '',
    puntos: '',
    fecha: new Date().toISOString().split('T')[0],
    severidad: 'leve',
    observaciones: ''
  });

  useEffect(() => { getAlumnos(); /* eslint-disable-next-line */ }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.alumnoId || !formData.descripcion || !formData.puntos) {
      setAlert('Alumno, descripcion y puntos son obligatorios', 'error');
      return;
    }
    try {
      const alumno = alumnos.find(a => a.id === formData.alumnoId);
      await addConducta({
        ...formData,
        puntos: Number(formData.puntos),
        alumnoNombre: alumno ? `${alumno.apellido}, ${alumno.nombre}` : '',
        esSancion: true
      });
      setAlert('Sancion registrada exitosamente', 'success');
      navigate('/conductas');
    } catch (error) {
      setAlert('Error al registrar la sancion', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/conductas')}>Volver</Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Nueva Sancion</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select fullWidth label="Alumno" name="alumnoId"
                value={formData.alumnoId} onChange={onChange} required
              >
                <MenuItem value=""><em>Seleccionar alumno</em></MenuItem>
                {alumnos.map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.apellido}, {a.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select fullWidth label="Severidad" name="severidad"
                value={formData.severidad} onChange={onChange}
              >
                <MenuItem value="leve">Leve</MenuItem>
                <MenuItem value="moderada">Moderada</MenuItem>
                <MenuItem value="grave">Grave</MenuItem>
                <MenuItem value="muy grave">Muy Grave</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Descripcion de la sancion" name="descripcion"
                value={formData.descripcion} onChange={onChange} required multiline rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Puntos (1-10)" name="puntos" type="number"
                value={formData.puntos} onChange={onChange} required
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Fecha" name="fecha" type="date"
                value={formData.fecha} onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Observaciones" name="observaciones"
                value={formData.observaciones} onChange={onChange} multiline rows={2}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/conductas')}>Cancelar</Button>
            <Button type="submit" variant="contained" color="error" startIcon={<Save />}>
              Registrar Sancion
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SancionForm;
