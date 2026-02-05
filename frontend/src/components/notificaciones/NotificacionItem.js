import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CircleIcon from '@mui/icons-material/Circle';

const NotificacionItem = ({ notificacion, onMarcarLeida }) => {
  const { id, titulo, mensaje, fecha, leida, tipo } = notificacion;

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'info':
        return 'info.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      case 'success':
        return 'success.main';
      default:
        return 'primary.main';
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          p: 2,
          bgcolor: leida ? 'transparent' : 'action.hover',
          '&:hover': { bgcolor: 'action.selected' }
        }}
      >
        <Box sx={{ mr: 2, mt: 0.5 }}>
          <CircleIcon
            sx={{
              fontSize: 12,
              color: leida ? 'grey.300' : getTipoColor(tipo)
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: leida ? 'normal' : 'bold' }}
          >
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mensaje}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {fecha}
          </Typography>
        </Box>

        {!leida && (
          <Tooltip title="Marcar como leida">
            <IconButton
              size="small"
              onClick={() => onMarcarLeida(id)}
              color="primary"
            >
              <MarkEmailReadIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Divider />
    </>
  );
};

export default NotificacionItem;
