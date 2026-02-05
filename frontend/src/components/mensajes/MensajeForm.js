import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Paper, Box, Grid
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import { createConversacion } from '../../services/mensajeService';

const MensajeForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [formData, setFormData] = useState({ destinatario: '', titulo: '', texto: '' });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.texto) {
      setAlert('Titulo y mensaje son obligatorios', 'error');
      return;
    }
    try {
      await createConversacion({
        titulo: formData.titulo,
        participantes: [user.uid],
        lastMessage: formData.texto,
        createdBy: user.uid
      });
      setAlert('Mensaje enviado', 'success');
      navigate('/mensajes');
    } catch (error) {
      setAlert('Error al enviar mensaje', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/mensajes')}>Volver</Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Nuevo Mensaje</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Destinatario" name="destinatario" value={formData.destinatario} onChange={onChange} placeholder="Email del destinatario" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Asunto" name="titulo" value={formData.titulo} onChange={onChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mensaje" name="texto" value={formData.texto} onChange={onChange} required multiline rows={6} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" startIcon={<Send />} size="large">Enviar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MensajeForm;
