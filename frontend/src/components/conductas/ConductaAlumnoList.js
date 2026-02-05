import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ConductaContext from '../../context/conductas/ConductaContext';
import AlumnoContext from '../../context/alumnos/AlumnoContext';
import AlertContext from '../../context/alert/AlertContext';
import Loading from '../layout/Loading';

const ConductaAlumnoList = () => {
  const { alumnoId } = useParams();
  const navigate = useNavigate();
  
  const conductaContext = useContext(ConductaContext);
  const alumnoContext = useContext(AlumnoContext);
  const alertContext = useContext(AlertContext);
  
  const { conductasAlumno, estadisticas, getConductasAlumno, deleteConducta } = conductaContext;
  const { getAlumno, alumno } = alumnoContext;
  const { setAlert } = alertContext;
  
  const [filtros, setFiltros] = useState({
    tipo: '',
    desde: '',
    hasta: ''
  });
  
  const [openFilter, setOpenFilter] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await getAlumno(alumnoId);
        await getConductasAlumno(alumnoId);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [alumnoId]);
  
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  
  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAplicarFiltros = () => {
    getConductasAlumno(alumnoId, filtros);
    setOpenFilter(false);
  };
  
  const handleLimpiarFiltros = () => {
    setFiltros({
      tipo: '',
      desde: '',
      hasta: ''
    });
    getConductasAlumno(alumnoId);
    setOpenFilter(false);
  };
  
  const handleNuevaConducta = () => {
    navigate('/conductas/nuevo', { state: { alumnoId } });
  };
  
  const handleEdit = (id) => {
    navigate(`/conductas/editar/${id}`);
  };
  
  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteConducta(confirmDelete.id);
      setAlert('Registro de conducta eliminado con éxito', 'success');
    } catch (error) {
      setAlert('Error al eliminar el registro', 'error');
    }
    setConfirmDelete({ open: false, id: null });
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, id: null });
  };
  
  const handleViewConducta = (id) => {
    navigate(`/conductas/${id}`);
  };
  
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    return date.toLocaleDateString();
  };
  
  if (loading || !alumno) {
    return <Loading />;
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/conductas')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          Conducta de Alumno: {alumno.apellido}, {alumno.nombre}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Alumno
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" gutterBottom>
                <strong>Nombre completo:</strong> {alumno.apellido}, {alumno.nombre}
              </Typography>
              
              <Typography variant="body1" gutterBottom>
                <strong>Documento:</strong> {alumno.documento}
              </Typography>
              
              {alumno.cursoNombre && (
                <Typography variant="body1" gutterBottom>
                  <strong>Curso:</strong> {alumno.cursoNombre}
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Conducta
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {estadisticas ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Total de registros:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {estadisticas.total}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="success.main">
                      <strong>Conductas positivas:</strong>
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      {estadisticas.positivas}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="error.main">
                      <strong>Conductas negativas:</strong>
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      {estadisticas.negativas}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                      <strong>Balance de puntos:</strong>
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={estadisticas.puntos >= 0 ? 'success.main' : 'error.main'}
                    >
                      {estadisticas.puntos}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No hay datos disponibles
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Registros de Conducta
              </Typography>
              
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={handleOpenFilter}
                  sx={{ mr: 1 }}
                >
                  Filtros
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNuevaConducta}
                >
                  Nuevo Registro
                </Button>
              </Box>
            </Box>
            
            <List>
              {conductasAlumno && conductasAlumno.length > 0 ? (
                conductasAlumno.map(conducta => (
                  <React.Fragment key={conducta.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        bgcolor: conducta.tipo === 'positiva' 
                          ? 'rgba(76, 175, 80, 0.08)' 
                          : 'rgba(244, 67, 54, 0.08)',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        {conducta.tipo === 'positiva' 
                          ? <ThumbUpIcon color="success" /> 
                          : <WarningIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {conducta.descripcion.substring(0, 50)}
                                {conducta.descripcion.length > 50 ? '...' : ''}
                              </Typography>
                              <Chip 
                                label={`${conducta.puntos} puntos`}
                                size="small"
                                color={conducta.tipo === 'positiva' ? 'success' : 'error'}
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              {formatFecha(conducta.fecha)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {conducta.materia && (
                              <Typography variant="body2" component="span">
                                <strong>Materia:</strong> {conducta.materia.nombre} | 
                              </Typography>
                            )}
                            {conducta.sancion?.applied && (
                              <Chip 
                                label={conducta.sancion.tipo}
                                size="small"
                                color="warning"
                                sx={{ ml: 1 }}
                              />
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleViewConducta(conducta.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(conducta.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography color="textSecondary" align="center">
                        No hay registros de conducta para este alumno
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Diálogo de filtros */}
      <Dialog
        open={openFilter}
        onClose={handleCloseFilter}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Filtrar Registros de Conducta
          <IconButton
            aria-label="close"
            onClick={handleCloseFilter}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={filtros.tipo}
                  label="Tipo"
                  onChange={handleFiltroChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="positiva">Positiva</MenuItem>
                  <MenuItem value="negativa">Negativa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Desde"
                type="date"
                name="desde"
                value={filtros.desde}
                onChange={handleFiltroChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hasta"
                type="date"
                name="hasta"
                value={filtros.hasta}
                onChange={handleFiltroChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLimpiarFiltros}>Limpiar</Button>
          <Button onClick={handleAplicarFiltros} variant="contained">Aplicar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={confirmDelete.open}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Eliminar Registro de Conducta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConductaAlumnoList;