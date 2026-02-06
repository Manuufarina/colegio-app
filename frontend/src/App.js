import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Toolbar } from '@mui/material';
import './App.css';

// Context Providers
import AlertState from './context/alert/AlertState';
import AuthState from './context/auth/AuthState';
import AlumnoState from './context/alumnos/AlumnoState';
import CursoState from './context/cursos/CursoState';
import MateriaState from './context/materias/MateriaState';
import CalificacionState from './context/calificaciones/CalificacionState';
import AsistenciaState from './context/asistencias/AsistenciaState';
import ConductaState from './context/conductas/ConductaState';
import EventoState from './context/eventos/EventoState';
import MensajeState from './context/mensajes/MensajeState';
import NotificacionState from './context/notificaciones/NotificacionState';
import BoletinState from './context/boletines/BoletinState';
import EstadisticaState from './context/estadisticas/EstadisticaState';

// Layout
import Header from './components/layout/Header';
import Sidebar, { drawerWidth } from './components/layout/Sidebar';
import Alert from './components/layout/Alert';
import NotFound from './components/layout/NotFound';
import Dashboard from './components/layout/Dashboard';
import Loading from './components/layout/Loading';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';

// Alumnos
import AlumnoList from './components/alumnos/AlumnoList';
import AlumnoForm from './components/alumnos/AlumnoForm';

// Cursos
import CursoList from './components/cursos/CursoList';
import CursoForm from './components/cursos/CursoForm';

// Materias
import MateriaList from './components/materias/MateriaList';
import MateriaForm from './components/materias/MateriaForm';

// Calificaciones
import CalificacionList from './components/calificaciones/CalificacionList';
import CalificacionForm from './components/calificaciones/CalificacionForm';

// Asistencias
import AsistenciaPage from './components/asistencias/AsistenciaPage';

// Conductas
import ConductaList from './components/conductas/ConductaList';
import ConductaForm from './components/conductas/ConductaForm';
import ConductaAlumnoList from './components/conductas/ConductaAlumnoList';

// Boletines
import BoletinesCurso from './components/boletines/BoletinesCurso';
import BoletinAlumno from './components/boletines/BoletinAlumno';

// Eventos
import CalendarioPage from './components/eventos/Calendariopage';

// Mensajes
import MensajesList from './components/mensajes/MensajesList';

// Notificaciones
import NotificacionesList from './components/notificaciones/NotificacionesList';

// Estadisticas
import EstadisticasDashboard from './components/estadisticas/EstadisticasDashboard';

// Gestión integral
import GestionIntegralPage from './components/gestion/GestionIntegralPage';

import AuthContext from './context/auth/AuthContext';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#7b1fa2' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Alert />
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/alumnos" element={<PrivateRoute><AlumnoList /></PrivateRoute>} />
          <Route path="/alumnos/nuevo" element={<PrivateRoute><AlumnoForm /></PrivateRoute>} />
          <Route path="/alumnos/editar/:id" element={<PrivateRoute><AlumnoForm /></PrivateRoute>} />
          <Route path="/cursos" element={<PrivateRoute><CursoList /></PrivateRoute>} />
          <Route path="/cursos/nuevo" element={<PrivateRoute><CursoForm /></PrivateRoute>} />
          <Route path="/cursos/editar/:id" element={<PrivateRoute><CursoForm /></PrivateRoute>} />
          <Route path="/materias" element={<PrivateRoute><MateriaList /></PrivateRoute>} />
          <Route path="/materias/nuevo" element={<PrivateRoute><MateriaForm /></PrivateRoute>} />
          <Route path="/materias/editar/:id" element={<PrivateRoute><MateriaForm /></PrivateRoute>} />
          <Route path="/calificaciones" element={<PrivateRoute><CalificacionList /></PrivateRoute>} />
          <Route path="/calificaciones/nuevo" element={<PrivateRoute><CalificacionForm /></PrivateRoute>} />
          <Route path="/asistencias" element={<PrivateRoute><AsistenciaPage /></PrivateRoute>} />
          <Route path="/conductas" element={<PrivateRoute><ConductaList /></PrivateRoute>} />
          <Route path="/conductas/nuevo" element={<PrivateRoute><ConductaForm /></PrivateRoute>} />
          <Route path="/conductas/alumno/:alumnoId" element={<PrivateRoute><ConductaAlumnoList /></PrivateRoute>} />
          <Route path="/boletines" element={<PrivateRoute><BoletinesCurso /></PrivateRoute>} />
          <Route path="/boletines/:alumnoId" element={<PrivateRoute><BoletinAlumno /></PrivateRoute>} />
          <Route path="/eventos" element={<PrivateRoute><CalendarioPage /></PrivateRoute>} />
          <Route path="/mensajes" element={<PrivateRoute><MensajesList /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><NotificacionesList /></PrivateRoute>} />
          <Route path="/estadisticas" element={<PrivateRoute><EstadisticasDashboard /></PrivateRoute>} />
          <Route path="/gestion-integral" element={<PrivateRoute><GestionIntegralPage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthState>
        <AlertState>
          <AlumnoState>
            <CursoState>
              <MateriaState>
                <CalificacionState>
                  <AsistenciaState>
                    <ConductaState>
                      <EventoState>
                        <MensajeState>
                          <NotificacionState>
                            <BoletinState>
                              <EstadisticaState>
                                <Router>
                                  <AppContent />
                                </Router>
                              </EstadisticaState>
                            </BoletinState>
                          </NotificacionState>
                        </MensajeState>
                      </EventoState>
                    </ConductaState>
                  </AsistenciaState>
                </CalificacionState>
              </MateriaState>
            </CursoState>
          </AlumnoState>
        </AlertState>
      </AuthState>
    </ThemeProvider>
  );
}

export default App;
