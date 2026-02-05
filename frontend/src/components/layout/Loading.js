import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <CircularProgress size={60} />
    <Typography sx={{ mt: 2 }} color="text.secondary">Cargando...</Typography>
  </Box>
);

export default Loading;
