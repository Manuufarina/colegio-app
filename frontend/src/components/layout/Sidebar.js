import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Divider, Typography, Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Grade as GradeIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  ThumbsUpDown as ThumbsUpDownIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Alumnos', icon: <PeopleIcon />, path: '/alumnos' },
  { text: 'Cursos', icon: <SchoolIcon />, path: '/cursos' },
  { text: 'Materias', icon: <MenuBookIcon />, path: '/materias' },
  { text: 'Calificaciones', icon: <GradeIcon />, path: '/calificaciones' },
  { text: 'Asistencias', icon: <CheckCircleIcon />, path: '/asistencias' },
  { text: 'Conducta', icon: <ThumbsUpDownIcon />, path: '/conductas' },
  { text: 'Boletines', icon: <DescriptionIcon />, path: '/boletines' },
  { text: 'Eventos', icon: <CalendarIcon />, path: '/eventos' },
  { text: 'Mensajes', icon: <MessageIcon />, path: '/mensajes' },
  { text: 'Estadisticas', icon: <BarChartIcon />, path: '/estadisticas' },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const drawer = (
    <>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="bold">ColegioApp</Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export { drawerWidth };
export default Sidebar;
