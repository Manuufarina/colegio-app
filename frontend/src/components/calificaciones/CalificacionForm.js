import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import CalificacionContext from '../../context/calificaciones/CalificacionContext';
import CursoContext from '../../context/cursos/CursoContext';
import MateriaContext from '../../context/materias/MateriaContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import AlertContext from '../../context/alert/AlertContext';

const CalificacionForm = () => {
  const navigate = useNavigate();
  const { addCalificacion } = useContext(CalificacionContext);
  const { cursos, getCursos } = useContext(CursoContext);
  const { materias, getMateriasByCurso } = useContext(MateriaContext);
  const { alumnos, getAlumnosByCurso } = useContext(AlumnoContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    cursoId: '', alumnoId: '', alumnoNombre: '', materiaId: '', materiaNombre: '',
    nota: '', periodo: '1er Trimestre', tipo: 'Examen', fecha: new Date().toISOString().split('T')[0], observaciones: ''
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getCursos(); }, []);
  useEffect(() => {
    if (formData.cursoId) {
      getMateriasByCurso(formData.cursoId);
      getAlumnosByCurso(formData.cursoId);
    }
  }, [formData.cursoId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };
    if (name === 'alumnoId') {
      const al = alumnos.find(a => a.id === value);
      updates.alumnoNombre = al ? `${al.apellido}, ${al.nombre}` : '';
    }
    if (name === 'materiaId') {
      const mat = materias.find(m => m.id === value);
      updates.materiaNombre = mat ? mat.nombre : '';
    }
    setFormData({ ...formData, ...updates });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.alumnoId || !formData.materiaId || !formData.nota) {
      setAlert('Alumno, materia y nota son obligatorios', 'error'); return;
    }
    await addCalificacion({ ...formData, nota: parseFloat(formData.nota) });
    setAlert('Calificacion registrada', 'success');
    navigate('/calificaciones');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}><Button startIcon={<ArrowBack />} onClick={() => navigate('/calificaciones')}>Volver</Button></Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Nueva Calificacion</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Curso</InputLabel>
                <Select name="cursoId" value={formData.cursoId} label="Curso" onChange={onChange}>
                  {cursos.map(c => <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Alumno</InputLabel>
                <Select name="alumnoId" value={formData.alumnoId} label="Alumno" onChange={onChange}>
                  {alumnos.map(a => <MenuItem key={a.id} value={a.id}>{a.apellido}, {a.nombre}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Materia</InputLabel>
                <Select name="materiaId" value={formData.materiaId} label="Materia" onChange={onChange}>
                  {materias.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Nota" name="nota" type="number" value={formData.nota} onChange={onChange} required inputProps={{ min: 1, max: 10, step: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Periodo</InputLabel>
                <Select name="periodo" value={formData.periodo} label="Periodo" onChange={onChange}>
                  <MenuItem value="1er Trimestre">1er Trimestre</MenuItem>
                  <MenuItem value="2do Trimestre">2do Trimestre</MenuItem>
                  <MenuItem value="3er Trimestre">3er Trimestre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={onChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select name="tipo" value={formData.tipo} label="Tipo" onChange={onChange}>
                  <MenuItem value="Examen">Examen</MenuItem>
                  <MenuItem value="Trabajo Practico">Trabajo Practico</MenuItem>
                  <MenuItem value="Oral">Oral</MenuItem>
                  <MenuItem value="Concepto">Concepto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Observaciones" name="observaciones" value={formData.observaciones} onChange={onChange} multiline rows={2} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" startIcon={<Save />} size="large">Guardar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CalificacionForm;
