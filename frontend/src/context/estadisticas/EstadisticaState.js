import React, { useReducer } from 'react';
import EstadisticaContext from './EstadisticaContext';
import { GET_ESTADISTICAS, ESTADISTICA_ERROR } from '../types';
import * as alumnoService from '../../services/alumnoService';
import * as cursoService from '../../services/cursoService';
import * as calificacionService from '../../services/calificacionService';

const estadisticaReducer = (state, action) => {
  switch (action.type) {
    case GET_ESTADISTICAS:
      return { ...state, estadisticas: action.payload, loading: false };
    case ESTADISTICA_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const EstadisticaState = ({ children }) => {
  const [state, dispatch] = useReducer(estadisticaReducer, {
    estadisticas: null, error: null, loading: true
  });

  const getEstadisticasGenerales = async () => {
    try {
      const [alumnos, cursos] = await Promise.all([
        alumnoService.getAlumnos(),
        cursoService.getCursos()
      ]);
      dispatch({
        type: GET_ESTADISTICAS,
        payload: {
          totalAlumnos: alumnos.length,
          totalCursos: cursos.length,
          alumnosPorCurso: cursos.map(c => ({
            curso: `${c.anio}° ${c.division}`,
            cantidad: alumnos.filter(a => a.cursoId === c.id).length
          }))
        }
      });
    } catch (error) {
      dispatch({ type: ESTADISTICA_ERROR, payload: error.message });
    }
  };

  const getEstadisticasCurso = async (cursoId) => {
    try {
      const [alumnos, calificaciones] = await Promise.all([
        alumnoService.getAlumnosByCurso(cursoId),
        calificacionService.getCalificacionesByCurso(cursoId)
      ]);
      const promedios = alumnos.map(a => {
        const notas = calificaciones.filter(c => c.alumnoId === a.id);
        const promedio = notas.length > 0
          ? notas.reduce((sum, n) => sum + (n.nota || 0), 0) / notas.length
          : 0;
        return { alumno: `${a.apellido}, ${a.nombre}`, promedio: Math.round(promedio * 100) / 100 };
      });
      dispatch({
        type: GET_ESTADISTICAS,
        payload: { totalAlumnos: alumnos.length, promedios }
      });
    } catch (error) {
      dispatch({ type: ESTADISTICA_ERROR, payload: error.message });
    }
  };

  return (
    <EstadisticaContext.Provider value={{
      estadisticas: state.estadisticas, error: state.error, loading: state.loading,
      getEstadisticasGenerales, getEstadisticasCurso
    }}>
      {children}
    </EstadisticaContext.Provider>
  );
};

export default EstadisticaState;
