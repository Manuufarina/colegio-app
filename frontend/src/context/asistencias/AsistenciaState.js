import React, { useReducer } from 'react';
import AsistenciaContext from './AsistenciaContext';
import { GET_ASISTENCIAS, ADD_ASISTENCIA, UPDATE_ASISTENCIA, ASISTENCIA_ERROR } from '../types';
import * as asistenciaService from '../../services/asistenciaService';

const asistenciaReducer = (state, action) => {
  switch (action.type) {
    case GET_ASISTENCIAS:
      return { ...state, asistencias: action.payload, loading: false };
    case ADD_ASISTENCIA:
      return { ...state, asistencias: [...state.asistencias, ...( Array.isArray(action.payload) ? action.payload : [action.payload])], loading: false };
    case UPDATE_ASISTENCIA:
      return { ...state, asistencias: state.asistencias.map(a => a.id === action.payload.id ? action.payload : a), loading: false };
    case ASISTENCIA_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AsistenciaState = ({ children }) => {
  const [state, dispatch] = useReducer(asistenciaReducer, {
    asistencias: [], error: null, loading: true
  });

  const getAsistenciasByCurso = async (cursoId, fecha) => {
    try {
      const data = await asistenciaService.getAsistenciasByCurso(cursoId, fecha);
      dispatch({ type: GET_ASISTENCIAS, payload: data });
    } catch (error) {
      dispatch({ type: ASISTENCIA_ERROR, payload: error.message });
    }
  };

  const getAsistenciasByAlumno = async (alumnoId) => {
    try {
      const data = await asistenciaService.getAsistenciasByAlumno(alumnoId);
      dispatch({ type: GET_ASISTENCIAS, payload: data });
    } catch (error) {
      dispatch({ type: ASISTENCIA_ERROR, payload: error.message });
    }
  };

  const addAsistencia = async (asistencia) => {
    try {
      const data = await asistenciaService.addAsistencia(asistencia);
      dispatch({ type: ADD_ASISTENCIA, payload: data });
    } catch (error) {
      dispatch({ type: ASISTENCIA_ERROR, payload: error.message });
    }
  };

  const addAsistenciaMasiva = async (registros) => {
    try {
      const data = await asistenciaService.addAsistenciaMasiva(registros);
      dispatch({ type: ADD_ASISTENCIA, payload: data });
    } catch (error) {
      dispatch({ type: ASISTENCIA_ERROR, payload: error.message });
    }
  };

  const updateAsistencia = async (id, asistencia) => {
    try {
      const data = await asistenciaService.updateAsistencia(id, asistencia);
      dispatch({ type: UPDATE_ASISTENCIA, payload: data });
    } catch (error) {
      dispatch({ type: ASISTENCIA_ERROR, payload: error.message });
    }
  };

  return (
    <AsistenciaContext.Provider value={{
      asistencias: state.asistencias, error: state.error, loading: state.loading,
      getAsistenciasByCurso, getAsistenciasByAlumno, addAsistencia, addAsistenciaMasiva, updateAsistencia
    }}>
      {children}
    </AsistenciaContext.Provider>
  );
};

export default AsistenciaState;
