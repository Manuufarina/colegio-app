import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccountBalance as InstitucionalIcon,
  AutoStories as AcademicoIcon,
  Diversity3 as ConvivenciaIcon,
  Badge as RRHHIcon,
  FamilyRestroom as FamiliasIcon,
} from '@mui/icons-material';

const STORAGE_KEYS = {
  legajos: 'colegioapp.gestion.legajos',
  planificaciones: 'colegioapp.gestion.planificaciones',
  intervenciones: 'colegioapp.gestion.intervenciones',
  personal: 'colegioapp.gestion.personal',
  solicitudes: 'colegioapp.gestion.solicitudes',
};

const loadStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const SectionHeader = ({ title, subtitle, icon }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
    {icon}
    <Box>
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  </Stack>
);

const DataList = ({ items, columns, emptyLabel }) => {
  if (!items.length) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">{emptyLabel}</Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1}>
      {items.map((item, index) => (
        <Paper key={`${item.id}-${index}`} variant="outlined" sx={{ p: 1.5 }}>
          <Grid container spacing={1}>
            {columns.map((column) => (
              <Grid item xs={12} sm={6} md={3} key={column.key}>
                <Typography variant="caption" color="text.secondary">{column.label}</Typography>
                <Typography variant="body2" fontWeight={500}>{item[column.key] || '-'}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

const GestionIntegralPage = () => {
  const [tab, setTab] = useState(0);

  const [legajos, setLegajos] = useState(() => loadStorage(STORAGE_KEYS.legajos));
  const [planificaciones, setPlanificaciones] = useState(() => loadStorage(STORAGE_KEYS.planificaciones));
  const [intervenciones, setIntervenciones] = useState(() => loadStorage(STORAGE_KEYS.intervenciones));
  const [personal, setPersonal] = useState(() => loadStorage(STORAGE_KEYS.personal));
  const [solicitudes, setSolicitudes] = useState(() => loadStorage(STORAGE_KEYS.solicitudes));

  const [legajoForm, setLegajoForm] = useState({ alumno: '', tutor: '', contacto: '', salud: '' });
  const [planForm, setPlanForm] = useState({ materia: '', docente: '', competencia: '', periodo: '' });
  const [intervencionForm, setIntervencionForm] = useState({ alumno: '', caso: '', accion: '', estado: 'Abierto' });
  const [personalForm, setPersonalForm] = useState({ nombre: '', rol: '', estado: 'Activo', carga: '' });
  const [solicitudForm, setSolicitudForm] = useState({ familia: '', tipo: 'Justificación de inasistencia', detalle: '', estado: 'Pendiente' });

  const indicadores = useMemo(() => ([
    { label: 'Legajos activos', value: legajos.length },
    { label: 'Planificaciones cargadas', value: planificaciones.length },
    { label: 'Intervenciones abiertas', value: intervenciones.filter((item) => item.estado === 'Abierto').length },
    { label: 'Personal registrado', value: personal.length },
    { label: 'Solicitudes de familias pendientes', value: solicitudes.filter((item) => item.estado === 'Pendiente').length },
  ]), [intervenciones, legajos.length, personal.length, planificaciones.length, solicitudes]);

  const addItem = (setter, key, state, resetState) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const next = [{ id, ...state }, ...loadStorage(key)];
    saveStorage(key, next);
    setter(next);
    resetState();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>Gestión integral (ideas 1, 2, 3, 5 y 6)</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Módulo unificado para administración institucional, académica, convivencia, RRHH y portal de familias.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {indicadores.map((kpi) => (
          <Grid item xs={12} sm={6} md key={kpi.label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{kpi.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab label="1. Gestión institucional" />
          <Tab label="2. Académico avanzado" />
          <Tab label="3. Convivencia" />
          <Tab label="5. RRHH y operación" />
          <Tab label="6. Portal familias" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Stack spacing={2}>
          <SectionHeader
            title="Legajo único alumno/familia"
            subtitle="Registro administrativo con tutor, contacto de emergencia y observaciones médicas."
            icon={<InstitucionalIcon color="primary" />}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Alumno" value={legajoForm.alumno} onChange={(e) => setLegajoForm({ ...legajoForm, alumno: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Tutor" value={legajoForm.tutor} onChange={(e) => setLegajoForm({ ...legajoForm, tutor: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Contacto de emergencia" value={legajoForm.contacto} onChange={(e) => setLegajoForm({ ...legajoForm, contacto: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Salud / alergias" value={legajoForm.salud} onChange={(e) => setLegajoForm({ ...legajoForm, salud: e.target.value })} /></Grid>
          </Grid>
          <Button variant="contained" onClick={() => addItem(setLegajos, STORAGE_KEYS.legajos, legajoForm, () => setLegajoForm({ alumno: '', tutor: '', contacto: '', salud: '' }))}>Guardar legajo</Button>
          <DataList
            items={legajos}
            columns={[{ key: 'alumno', label: 'Alumno' }, { key: 'tutor', label: 'Tutor' }, { key: 'contacto', label: 'Contacto' }, { key: 'salud', label: 'Salud' }]}
            emptyLabel="Aún no hay legajos cargados."
          />
        </Stack>
      )}

      {tab === 1 && (
        <Stack spacing={2}>
          <SectionHeader
            title="Planificación docente y competencias"
            subtitle="Seguimiento de cobertura curricular, docente responsable y foco competencial."
            icon={<AcademicoIcon color="primary" />}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Materia" value={planForm.materia} onChange={(e) => setPlanForm({ ...planForm, materia: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Docente" value={planForm.docente} onChange={(e) => setPlanForm({ ...planForm, docente: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Competencia" value={planForm.competencia} onChange={(e) => setPlanForm({ ...planForm, competencia: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Periodo" value={planForm.periodo} onChange={(e) => setPlanForm({ ...planForm, periodo: e.target.value })} /></Grid>
          </Grid>
          <Button variant="contained" onClick={() => addItem(setPlanificaciones, STORAGE_KEYS.planificaciones, planForm, () => setPlanForm({ materia: '', docente: '', competencia: '', periodo: '' }))}>Agregar planificación</Button>
          <DataList
            items={planificaciones}
            columns={[{ key: 'materia', label: 'Materia' }, { key: 'docente', label: 'Docente' }, { key: 'competencia', label: 'Competencia' }, { key: 'periodo', label: 'Periodo' }]}
            emptyLabel="No hay planificaciones cargadas."
          />
        </Stack>
      )}

      {tab === 2 && (
        <Stack spacing={2}>
          <SectionHeader
            title="Ruta de intervención y seguimiento"
            subtitle="Registro de incidentes, acciones tomadas y estado del caso para convivencia escolar."
            icon={<ConvivenciaIcon color="primary" />}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Alumno" value={intervencionForm.alumno} onChange={(e) => setIntervencionForm({ ...intervencionForm, alumno: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Caso" value={intervencionForm.caso} onChange={(e) => setIntervencionForm({ ...intervencionForm, caso: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Acción tomada" value={intervencionForm.accion} onChange={(e) => setIntervencionForm({ ...intervencionForm, accion: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select size="small" fullWidth label="Estado" value={intervencionForm.estado} onChange={(e) => setIntervencionForm({ ...intervencionForm, estado: e.target.value })}>
                <MenuItem value="Abierto">Abierto</MenuItem>
                <MenuItem value="En seguimiento">En seguimiento</MenuItem>
                <MenuItem value="Cerrado">Cerrado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={() => addItem(setIntervenciones, STORAGE_KEYS.intervenciones, intervencionForm, () => setIntervencionForm({ alumno: '', caso: '', accion: '', estado: 'Abierto' }))}>Registrar intervención</Button>
          <Stack direction="row" spacing={1}>
            {['Abierto', 'En seguimiento', 'Cerrado'].map((estado) => (
              <Chip key={estado} label={`${estado}: ${intervenciones.filter((it) => it.estado === estado).length}`} />
            ))}
          </Stack>
          <DataList
            items={intervenciones}
            columns={[{ key: 'alumno', label: 'Alumno' }, { key: 'caso', label: 'Caso' }, { key: 'accion', label: 'Acción' }, { key: 'estado', label: 'Estado' }]}
            emptyLabel="Todavía no hay intervenciones cargadas."
          />
        </Stack>
      )}

      {tab === 3 && (
        <Stack spacing={2}>
          <SectionHeader
            title="RRHH y operación escolar"
            subtitle="Administración de personal, roles y carga horaria para cobertura operativa."
            icon={<RRHHIcon color="primary" />}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Nombre" value={personalForm.nombre} onChange={(e) => setPersonalForm({ ...personalForm, nombre: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Rol" value={personalForm.rol} onChange={(e) => setPersonalForm({ ...personalForm, rol: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select size="small" fullWidth label="Estado" value={personalForm.estado} onChange={(e) => setPersonalForm({ ...personalForm, estado: e.target.value })}>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Licencia">Licencia</MenuItem>
                <MenuItem value="Suplencia">Suplencia</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Carga / disponibilidad" value={personalForm.carga} onChange={(e) => setPersonalForm({ ...personalForm, carga: e.target.value })} /></Grid>
          </Grid>
          <Button variant="contained" onClick={() => addItem(setPersonal, STORAGE_KEYS.personal, personalForm, () => setPersonalForm({ nombre: '', rol: '', estado: 'Activo', carga: '' }))}>Guardar personal</Button>
          <DataList
            items={personal}
            columns={[{ key: 'nombre', label: 'Nombre' }, { key: 'rol', label: 'Rol' }, { key: 'estado', label: 'Estado' }, { key: 'carga', label: 'Carga' }]}
            emptyLabel="No hay personal cargado en este módulo."
          />
        </Stack>
      )}

      {tab === 4 && (
        <Stack spacing={2}>
          <SectionHeader
            title="Portal de familias"
            subtitle="Gestión de solicitudes de familias: justificaciones, autorizaciones y turnos."
            icon={<FamiliasIcon color="primary" />}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Familia" value={solicitudForm.familia} onChange={(e) => setSolicitudForm({ ...solicitudForm, familia: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select size="small" fullWidth label="Tipo" value={solicitudForm.tipo} onChange={(e) => setSolicitudForm({ ...solicitudForm, tipo: e.target.value })}>
                <MenuItem value="Justificación de inasistencia">Justificación de inasistencia</MenuItem>
                <MenuItem value="Autorización de retiro">Autorización de retiro</MenuItem>
                <MenuItem value="Solicitud de turno">Solicitud de turno</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}><TextField size="small" fullWidth label="Detalle" value={solicitudForm.detalle} onChange={(e) => setSolicitudForm({ ...solicitudForm, detalle: e.target.value })} /></Grid>
            <Grid item xs={12} md={3}>
              <TextField select size="small" fullWidth label="Estado" value={solicitudForm.estado} onChange={(e) => setSolicitudForm({ ...solicitudForm, estado: e.target.value })}>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Aprobada">Aprobada</MenuItem>
                <MenuItem value="Rechazada">Rechazada</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={() => addItem(setSolicitudes, STORAGE_KEYS.solicitudes, solicitudForm, () => setSolicitudForm({ familia: '', tipo: 'Justificación de inasistencia', detalle: '', estado: 'Pendiente' }))}>Registrar solicitud</Button>
          <Divider />
          <DataList
            items={solicitudes}
            columns={[{ key: 'familia', label: 'Familia' }, { key: 'tipo', label: 'Tipo' }, { key: 'detalle', label: 'Detalle' }, { key: 'estado', label: 'Estado' }]}
            emptyLabel="No hay solicitudes de familias registradas."
          />
        </Stack>
      )}
    </Box>
  );
};

export default GestionIntegralPage;
