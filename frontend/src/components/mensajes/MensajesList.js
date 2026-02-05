import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import MensajeContext from '../../context/mensajes/MensajeContext';
import Loading from '../layout/Loading';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Box,
  Divider,
  Chip,
  Button
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';
import AddIcon from '@mui/icons-material/Add';

const MensajesList = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const mensajeContext = useContext(MensajeContext);

  const { user } = authContext;
  const { mensajes, getMensajes, loading } = mensajeContext;

  useEffect(() => {
    if (user && user.uid) {
      getMensajes(user.uid);
    }
    // eslint-disable-next-line
  }, [user]);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Mensajes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/mensajes/nuevo')}
        >
          Nuevo Mensaje
        </Button>
      </Box>

      <Paper>
        <List>
          {mensajes && mensajes.length > 0 ? (
            mensajes.map((mensaje, index) => (
              <React.Fragment key={mensaje.id}>
                <ListItem
                  button
                  onClick={() => navigate(`/mensajes/${mensaje.id}`)}
                  sx={{
                    bgcolor: mensaje.leido ? 'transparent' : 'action.hover'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {mensaje.leido ? <DraftsIcon /> : <MailIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: mensaje.leido ? 'normal' : 'bold' }}
                        >
                          {mensaje.remitente || mensaje.asunto}
                        </Typography>
                        {!mensaje.leido && (
                          <Chip label="Nuevo" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {mensaje.asunto}
                        </Typography>
                        {' - '}
                        {mensaje.contenido && mensaje.contenido.substring(0, 80)}
                        {mensaje.contenido && mensaje.contenido.length > 80 ? '...' : ''}
                      </React.Fragment>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {mensaje.fecha}
                  </Typography>
                </ListItem>
                {index < mensajes.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" align="center" sx={{ py: 2 }}>
                    No hay mensajes
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default MensajesList;
