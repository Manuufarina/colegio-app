import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import MateriaContext from '../../context/materias/MateriaContext';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';

const MateriaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addMateria, updateMateria, materias } = useContext(MateriaContext);
  const { cursos, getCursos } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({ nombre: '', cursoId: '', cursoNombre: '', profesorNombre: '' });

  useEffect(() => {
    getCursos();
    if (id) {
      const materia = materias.find(m => m.id === id);
      if (materia) setFormData({ nombre: materia.nombre, cursoId: materia.cursoId || '', cursoNombre: materia.cursoNombre || '', profesorNombre: materia.profesorNombre || '' });
    }
    // eslint-disable-next-line
  }, [id]);

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
    if (!formData.nombre) { setAlert('El nombre es obligatorio', 'error'); return; }
    if (id) {
      await updateMateria(id, formData);
      setAlert('Materia actualizada', 'success');
    } else {
      await addMateria(formData);
      setAlert('Materia creada', 'success');
    }
    navigate('/materias');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}><Button startIcon={<ArrowBack />} onClick={() => navigate('/materias')}>Volver</Button></Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>{id ? 'Editar Materia' : 'Nueva Materia'}</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre de la materia" name="nombre" value={formData.nombre} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Curso</InputLabel>
                <Select name="cursoId" value={formData.cursoId} label="Curso" onChange={onChange}>
                  <MenuItem value="">Sin asignar</MenuItem>
                  {cursos.map(c => <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre del profesor" name="profesorNombre" value={formData.profesorNombre} onChange={onChange} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" startIcon={<Save />} size="large">{id ? 'Actualizar' : 'Guardar'}</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MateriaForm;
