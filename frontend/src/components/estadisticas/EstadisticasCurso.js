import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Grid, MenuItem, TextField, Card, CardContent
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CursoContext from '../../context/cursos/CursoContext';
import EstadisticaContext from '../../context/estadisticas/EstadisticaContext';
import Loading from '../layout/Loading';

const EstadisticasCurso = () => {
  const { cursos, getCursos } = useContext(CursoContext);
  const { estadisticas, loading, getEstadisticasCurso } = useContext(EstadisticaContext);
  const [cursoId, setCursoId] = useState('');

  useEffect(() => { getCursos(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { if (cursoId) getEstadisticasCurso(cursoId); /* eslint-disable-next-line */ }, [cursoId]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>Estadisticas por Curso</Typography>
      <TextField
        select label="Seleccionar Curso" value={cursoId}
        onChange={(e) => setCursoId(e.target.value)} sx={{ minWidth: 300, mb: 3 }}
      >
        <MenuItem value=""><em>Seleccionar</em></MenuItem>
        {cursos.map(c => <MenuItem key={c.id} value={c.id}>{c.anio}° {c.division}</MenuItem>)}
      </TextField>

      {cursoId && (loading ? <Loading /> : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="text.secondary">Alumnos en el curso</Typography>
                  <Typography variant="h3" fontWeight="bold">{estadisticas?.totalAlumnos || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {estadisticas?.promedios && estadisticas.promedios.length > 0 && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Promedio por Alumno</Typography>
              <ResponsiveContainer width="100%" height={Math.max(300, estadisticas.promedios.length * 40)}>
                <BarChart data={estadisticas.promedios} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis type="category" dataKey="alumno" width={110} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </>
      ))}
    </Container>
  );
};

export default EstadisticasCurso;
