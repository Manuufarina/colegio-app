import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Box, Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import AuthContext from '../../context/auth/AuthContext';
import NotificacionContext from '../../context/notificaciones/NotificacionContext';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { notificaciones } = useContext(NotificacionContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const unread = notificaciones ? notificaciones.filter(n => !n.leida).length : 0;

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Sistema de Gestion Escolar
        </Typography>
        <IconButton color="inherit" onClick={() => navigate('/notificaciones')}>
          <Badge badgeContent={unread} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box sx={{ ml: 1 }}>
          <IconButton color="inherit" onClick={handleMenu}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.nombre?.[0] || <AccountCircle />}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" /> Cerrar sesion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
