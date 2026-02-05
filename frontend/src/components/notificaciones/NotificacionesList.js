import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import NotificacionContext from '../../context/notificaciones/NotificacionContext';
import NotificacionItem from './NotificacionItem';
import Loading from '../layout/Loading';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const NotificacionesList = () => {
  const authContext = useContext(AuthContext);
  const notificacionContext = useContext(NotificacionContext);

  const { user } = authContext;
  const {
    notificaciones,
    getNotificaciones,
    marcarLeida,
    marcarTodasLeidas,
    loading
  } = notificacionContext;

  useEffect(() => {
    if (user && user.uid) {
      getNotificaciones(user.uid);
    }
    // eslint-disable-next-line
  }, [user]);

  const handleMarcarLeida = async (notificacionId) => {
    await marcarLeida(notificacionId);
  };

  const handleMarcarTodasLeidas = async () => {
    if (user && user.uid) {
      await marcarTodasLeidas(user.uid);
    }
  };

  const noLeidas = notificaciones
    ? notificaciones.filter((n) => !n.leida).length
    : 0;

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Notificaciones
          </Typography>
          {noLeidas > 0 && (
            <Typography variant="body2" color="text.secondary">
              {noLeidas} sin leer
            </Typography>
          )}
        </Box>
        {noLeidas > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={handleMarcarTodasLeidas}
          >
            Marcar todas como leidas
          </Button>
        )}
      </Box>

      <Paper>
        {notificaciones && notificaciones.length > 0 ? (
          notificaciones.map((notificacion) => (
            <NotificacionItem
              key={notificacion.id}
              notificacion={notificacion}
              onMarcarLeida={handleMarcarLeida}
            />
          ))
        ) : (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default NotificacionesList;
