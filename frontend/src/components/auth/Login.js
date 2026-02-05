import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import AuthContext from '../../context/auth/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearErrors, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    login(formData.email, formData.password);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">ColegioApp</Typography>
            <Typography color="text.secondary">Iniciar sesion</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth margin="normal" label="Email" name="email" type="email"
              value={formData.email} onChange={onChange} required autoFocus
            />
            <TextField
              fullWidth margin="normal" label="Contrasena" name="password" type="password"
              value={formData.password} onChange={onChange} required
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 3, mb: 2 }} disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <Button fullWidth onClick={() => navigate('/register')} color="secondary">
              Crear cuenta nueva
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
