import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Button, TextField, List,
  ListItem, ListItemText, Avatar, Divider
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import AuthContext from '../../context/auth/AuthContext';
import MensajeContext from '../../context/mensajes/MensajeContext';
import Loading from '../layout/Loading';

const MensajeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { mensajes, loading, getConversacion, sendMensaje } = useContext(MensajeContext);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    if (id) getConversacion(id);
    // eslint-disable-next-line
  }, [id]);

  const handleSend = async () => {
    if (!texto.trim()) return;
    await sendMensaje(id, { texto, senderId: user.uid, senderName: user.nombre || user.email });
    setTexto('');
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/mensajes')}>Volver</Button>
      </Box>
      <Paper elevation={3} sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Typography variant="h6">Conversacion</Typography>
        </Box>
        <List sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
          {mensajes.length === 0 ? (
            <ListItem><ListItemText primary={<Typography color="text.secondary" align="center">No hay mensajes</Typography>} /></ListItem>
          ) : mensajes.map((msg) => (
            <React.Fragment key={msg.id}>
              <ListItem sx={{ flexDirection: msg.senderId === user?.uid ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ mx: 1, bgcolor: msg.senderId === user?.uid ? 'primary.main' : 'secondary.main' }}>
                  {(msg.senderName || '?')[0]}
                </Avatar>
                <Paper sx={{
                  p: 1.5, maxWidth: '70%',
                  bgcolor: msg.senderId === user?.uid ? 'primary.light' : 'grey.100'
                }}>
                  <Typography variant="body2" fontWeight="bold">{msg.senderName || 'Usuario'}</Typography>
                  <Typography variant="body1">{msg.texto}</Typography>
                </Paper>
              </ListItem>
              <Divider variant="inset" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth size="small" placeholder="Escribir mensaje..."
            value={texto} onChange={(e) => setTexto(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" startIcon={<Send />} onClick={handleSend}>Enviar</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MensajeDetail;
