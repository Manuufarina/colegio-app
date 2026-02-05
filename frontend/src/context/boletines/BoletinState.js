import React, { useReducer } from 'react';
import BoletinContext from './BoletinContext';
import { GET_BOLETIN, BOLETIN_ERROR } from '../types';
import * as calificacionService from '../../services/calificacionService';
import * as alumnoService from '../../services/alumnoService';

const boletinReducer = (state, action) => {
  switch (action.type) {
    case GET_BOLETIN:
      return { ...state, boletin: action.payload, loading: false };
    case BOLETIN_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const BoletinState = ({ children }) => {
  const [state, dispatch] = useReducer(boletinReducer, {
    boletin: null, error: null, loading: true
  });

  const getBoletinAlumno = async (alumnoId, periodo) => {
    try {
      const alumno = await alumnoService.getAlumno(alumnoId);
      const calificaciones = await calificacionService.getCalificacionesByAlumno(alumnoId);
      const filtradas = periodo
        ? calificaciones.filter(c => c.periodo === periodo)
        : calificaciones;
      dispatch({
        type: GET_BOLETIN,
        payload: { alumno, calificaciones: filtradas, periodo }
      });
    } catch (error) {
      dispatch({ type: BOLETIN_ERROR, payload: error.message });
    }
  };

  return (
    <BoletinContext.Provider value={{
      boletin: state.boletin, error: state.error, loading: state.loading,
      getBoletinAlumno
    }}>
      {children}
    </BoletinContext.Provider>
  );
};

export default BoletinState;
