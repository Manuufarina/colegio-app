import React, { useState, useContext, useEffect } from 'react';
import EventoContext from '../../context/eventos/EventoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem
} from '@mui/material';

const CalendarioPage = () => {
  const eventoContext = useContext(EventoContext);
  const alertContext = useContext(AlertContext);

  const { eventos, getEventos, addEvento, deleteEvento, loading } = eventoContext;
  const { setAlert } = alertContext;

  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: '',
    color: '#1976d2'
  });

  useEffect(() => {
    getEventos();
    // eslint-disable-next-line
  }, []);

  const tiposEvento = [
    { value: 'academico', label: 'Academico' },
    { value: 'deportivo', label: 'Deportivo' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'feriado', label: 'Feriado' },
    { value: 'otro', label: 'Otro' }
  ];

  const coloresEvento = [
    { value: '#1976d2', label: 'Azul' },
    { value: '#388e3c', label: 'Verde' },
    { value: '#d32f2f', label: 'Rojo' },
    { value: '#f57c00', label: 'Naranja' },
    { value: '#7b1fa2', label: 'Morado' },
    { value: '#0097a7', label: 'Cyan' }
  ];

  const handleDateClick = (arg) => {
    setNuevoEvento({
      ...nuevoEvento,
      fechaInicio: arg.dateStr,
      fechaFin: arg.dateStr
    });
    setOpenDialog(true);
  };

  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`Desea eliminar el evento "${clickInfo.event.title}"?`)) {
      try {
        await deleteEvento(clickInfo.event.id);
        setAlert('Evento eliminado exitosamente', 'success');
      } catch (error) {
        setAlert('Error al eliminar el evento', 'error');
      }
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setNuevoEvento({
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      color: '#1976d2'
    });
  };

  const handleChange = (e) => {
    setNuevoEvento({ ...nuevoEvento, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { titulo, fechaInicio, fechaFin, tipo } = nuevoEvento;

    if (!titulo || !fechaInicio || !fechaFin || !tipo) {
      setAlert('Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    try {
      await addEvento(nuevoEvento);
      setAlert('Evento creado exitosamente', 'success');
      handleClose();
    } catch (error) {
      setAlert('Error al crear el evento', 'error');
    }
  };

  const calendarEvents = eventos
    ? eventos.map((evento) => ({
        id: evento.id,
        title: evento.titulo,
        start: evento.fechaInicio,
        end: evento.fechaFin,
        backgroundColor: evento.color || '#1976d2',
        borderColor: evento.color || '#1976d2'
      }))
    : [];

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" mb={3}>
        Calendario de Eventos
      </Typography>

      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          locale="es"
          height="auto"
        />
      </Box>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Evento</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              fullWidth
              label="Titulo"
              name="titulo"
              value={nuevoEvento.titulo}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Descripcion"
              name="descripcion"
              value={nuevoEvento.descripcion}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Fecha Inicio"
              name="fechaInicio"
              type="date"
              value={nuevoEvento.fechaInicio}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Fecha Fin"
              name="fechaFin"
              type="date"
              value={nuevoEvento.fechaFin}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              fullWidth
              label="Tipo"
              name="tipo"
              value={nuevoEvento.tipo}
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Seleccionar tipo</em>
              </MenuItem>
              {tiposEvento.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Color"
              name="color"
              value={nuevoEvento.color}
              onChange={handleChange}
            >
              {coloresEvento.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: color.value
                      }}
                    />
                    {color.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarioPage;
