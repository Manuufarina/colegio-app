import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import CursoContext from '../../context/cursos/CursoContext';
import AlertContext from '../../context/alert/AlertContext';

const CursoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCurso, updateCurso, getCurso, curso } = useContext(CursoContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    anio: '', division: '', turno: 'Manana', nivel: 'Secundario', capacidad: ''
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (id) getCurso(id); }, [id]);
  useEffect(() => {
    if (curso && id) {
      setFormData({
        anio: curso.anio || '', division: curso.division || '',
        turno: curso.turno || 'Manana', nivel: curso.nivel || 'Secundario',
        capacidad: curso.capacidad || ''
      });
    }
  }, [curso, id]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.anio || !formData.division) {
      setAlert('Ano y division son obligatorios', 'error'); return;
    }
    if (id) {
      await updateCurso(id, formData);
      setAlert('Curso actualizado', 'success');
    } else {
      await addCurso(formData);
      setAlert('Curso creado', 'success');
    }
    navigate('/cursos');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}><Button startIcon={<ArrowBack />} onClick={() => navigate('/cursos')}>Volver</Button></Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>{id ? 'Editar Curso' : 'Nuevo Curso'}</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ano</InputLabel>
                <Select name="anio" value={formData.anio} label="Ano" onChange={onChange} required>
                  {[1,2,3,4,5,6].map(n => <MenuItem key={n} value={n}>{n}°</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Division" name="division" value={formData.division} onChange={onChange} required placeholder="A, B, C..." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Turno</InputLabel>
                <Select name="turno" value={formData.turno} label="Turno" onChange={onChange}>
                  <MenuItem value="Manana">Manana</MenuItem>
                  <MenuItem value="Tarde">Tarde</MenuItem>
                  <MenuItem value="Noche">Noche</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Capacidad" name="capacidad" type="number" value={formData.capacidad} onChange={onChange} />
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

export default CursoForm;
