import React, { useReducer } from 'react';
import CalificacionContext from './CalificacionContext';
import { GET_CALIFICACIONES, ADD_CALIFICACION, UPDATE_CALIFICACION, DELETE_CALIFICACION, CALIFICACION_ERROR } from '../types';
import * as calificacionService from '../../services/calificacionService';

const calificacionReducer = (state, action) => {
  switch (action.type) {
    case GET_CALIFICACIONES:
      return { ...state, calificaciones: action.payload, loading: false };
    case ADD_CALIFICACION:
      return { ...state, calificaciones: [...state.calificaciones, action.payload], loading: false };
    case UPDATE_CALIFICACION:
      return { ...state, calificaciones: state.calificaciones.map(c => c.id === action.payload.id ? action.payload : c), loading: false };
    case DELETE_CALIFICACION:
      return { ...state, calificaciones: state.calificaciones.filter(c => c.id !== action.payload), loading: false };
    case CALIFICACION_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const CalificacionState = ({ children }) => {
  const [state, dispatch] = useReducer(calificacionReducer, {
    calificaciones: [], error: null, loading: true
  });

  const getCalificacionesByAlumno = async (alumnoId) => {
    try {
      const data = await calificacionService.getCalificacionesByAlumno(alumnoId);
      dispatch({ type: GET_CALIFICACIONES, payload: data });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  const getCalificacionesByMateria = async (materiaId, cursoId) => {
    try {
      const data = await calificacionService.getCalificacionesByMateria(materiaId, cursoId);
      dispatch({ type: GET_CALIFICACIONES, payload: data });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  const getCalificacionesByCurso = async (cursoId, periodo) => {
    try {
      const data = await calificacionService.getCalificacionesByCurso(cursoId, periodo);
      dispatch({ type: GET_CALIFICACIONES, payload: data });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  const addCalificacion = async (calificacion) => {
    try {
      const data = await calificacionService.addCalificacion(calificacion);
      dispatch({ type: ADD_CALIFICACION, payload: data });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  const updateCalificacion = async (id, calificacion) => {
    try {
      const data = await calificacionService.updateCalificacion(id, calificacion);
      dispatch({ type: UPDATE_CALIFICACION, payload: data });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  const deleteCalificacion = async (id) => {
    try {
      await calificacionService.deleteCalificacion(id);
      dispatch({ type: DELETE_CALIFICACION, payload: id });
    } catch (error) {
      dispatch({ type: CALIFICACION_ERROR, payload: error.message });
    }
  };

  return (
    <CalificacionContext.Provider value={{
      calificaciones: state.calificaciones, error: state.error, loading: state.loading,
      getCalificacionesByAlumno, getCalificacionesByMateria, getCalificacionesByCurso,
      addCalificacion, updateCalificacion, deleteCalificacion
    }}>
      {children}
    </CalificacionContext.Provider>
  );
};

export default CalificacionState;
