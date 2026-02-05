import React, { useContext } from 'react';
import { Alert as MuiAlert, Stack } from '@mui/material';
import AlertContext from '../../context/alert/AlertContext';

const Alert = () => {
  const { alerts } = useContext(AlertContext);

  if (!alerts || alerts.length === 0) return null;

  return (
    <Stack sx={{ width: '100%', mb: 2 }} spacing={1}>
      {alerts.map(alert => (
        <MuiAlert key={alert.id} severity={alert.type} variant="filled">
          {alert.msg}
        </MuiAlert>
      ))}
    </Stack>
  );
};

export default Alert;
