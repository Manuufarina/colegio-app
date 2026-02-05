import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';

const AlumnoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlumno, updateAlumno, getAlumno, alumno, clearAlumno } = useContext(AlumnoContext);
  const { cursos, getCursos } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', documento: '', fechaNacimiento: '',
    direccion: '', telefono: '', email: '', cursoId: '', cursoNombre: ''
  });

  useEffect(() => {
    getCursos();
    if (id) getAlumno(id);
    return () => clearAlumno();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (alumno && id) {
      setFormData({
        nombre: alumno.nombre || '', apellido: alumno.apellido || '',
        documento: alumno.documento || '', fechaNacimiento: alumno.fechaNacimiento || '',
        direccion: alumno.direccion || '', telefono: alumno.telefono || '',
        email: alumno.email || '', cursoId: alumno.cursoId || '',
        cursoNombre: alumno.cursoNombre || ''
      });
    }
  }, [alumno, id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cursoId') {
      const curso = cursos.find(c => c.id === value);
      setFormData({ ...formData, cursoId: value, cursoNombre: curso ? `${curso.anio}° ${curso.division}` : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido) {
      setAlert('Nombre y apellido son obligatorios', 'error');
      return;
    }
    if (id) {
      await updateAlumno(id, formData);
      setAlert('Alumno actualizado', 'success');
    } else {
      await addAlumno(formData);
      setAlert('Alumno creado', 'success');
    }
    navigate('/alumnos');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/alumnos')}>Volver</Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>{id ? 'Editar Alumno' : 'Nuevo Alumno'}</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Apellido" name="apellido" value={formData.apellido} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Documento" name="documento" value={formData.documento} onChange={onChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={onChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Curso</InputLabel>
                <Select name="cursoId" value={formData.cursoId} label="Curso" onChange={onChange}>
                  <MenuItem value="">Sin asignar</MenuItem>
                  {cursos.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division} - {c.turno}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Telefono" name="telefono" value={formData.telefono} onChange={onChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={onChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Direccion" name="direccion" value={formData.direccion} onChange={onChange} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" startIcon={<Save />} size="large">
              {id ? 'Actualizar' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AlumnoForm;
