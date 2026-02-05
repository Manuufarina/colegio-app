import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import AuthContext from '../../context/auth/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error, clearErrors, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', password2: '', rol: 'profesor'
  });

  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    clearErrors();
    if (formData.password !== formData.password2) {
      setLocalError('Las contrasenas no coinciden');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    register(formData);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 1 }}>
            Crear Cuenta
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
            Registro de nuevo usuario
          </Typography>
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>
          )}
          <Box component="form" onSubmit={onSubmit}>
            <TextField fullWidth margin="normal" label="Nombre" name="nombre" value={formData.nombre} onChange={onChange} required />
            <TextField fullWidth margin="normal" label="Apellido" name="apellido" value={formData.apellido} onChange={onChange} required />
            <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={onChange} required />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select name="rol" value={formData.rol} label="Rol" onChange={onChange}>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="profesor">Profesor</MenuItem>
                <MenuItem value="preceptor">Preceptor</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth margin="normal" label="Contrasena" name="password" type="password" value={formData.password} onChange={onChange} required />
            <TextField fullWidth margin="normal" label="Confirmar contrasena" name="password2" type="password" value={formData.password2} onChange={onChange} required />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Button fullWidth onClick={() => navigate('/login')} color="secondary">
              Ya tengo cuenta
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
