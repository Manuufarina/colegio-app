import React, { useReducer } from 'react';
import ConductaContext from './ConductaContext';
import { GET_CONDUCTAS, GET_CONDUCTAS_ALUMNO, ADD_CONDUCTA, UPDATE_CONDUCTA, DELETE_CONDUCTA, CONDUCTA_ERROR } from '../types';
import * as conductaService from '../../services/conductaService';

const conductaReducer = (state, action) => {
  switch (action.type) {
    case GET_CONDUCTAS:
      return { ...state, conductas: action.payload, loading: false };
    case GET_CONDUCTAS_ALUMNO:
      return { ...state, conductasAlumno: action.payload.conductas, estadisticas: action.payload.estadisticas, loading: false };
    case ADD_CONDUCTA:
      return { ...state, conductas: [action.payload, ...state.conductas], loading: false };
    case UPDATE_CONDUCTA:
      return { ...state, conductas: state.conductas.map(c => c.id === action.payload.id ? action.payload : c), loading: false };
    case DELETE_CONDUCTA:
      return {
        ...state,
        conductas: state.conductas.filter(c => c.id !== action.payload),
        conductasAlumno: state.conductasAlumno.filter(c => c.id !== action.payload),
        loading: false
      };
    case CONDUCTA_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const ConductaState = ({ children }) => {
  const [state, dispatch] = useReducer(conductaReducer, {
    conductas: [], conductasAlumno: [], estadisticas: null, error: null, loading: true
  });

  const getConductas = async () => {
    try {
      const data = await conductaService.getConductas();
      dispatch({ type: GET_CONDUCTAS, payload: data });
    } catch (error) {
      dispatch({ type: CONDUCTA_ERROR, payload: error.message });
    }
  };

  const getConductasAlumno = async (alumnoId, filtros) => {
    try {
      const data = await conductaService.getConductasByAlumno(alumnoId, filtros);
      dispatch({ type: GET_CONDUCTAS_ALUMNO, payload: data });
    } catch (error) {
      dispatch({ type: CONDUCTA_ERROR, payload: error.message });
    }
  };

  const addConducta = async (conducta) => {
    try {
      const data = await conductaService.addConducta(conducta);
      dispatch({ type: ADD_CONDUCTA, payload: data });
    } catch (error) {
      dispatch({ type: CONDUCTA_ERROR, payload: error.message });
    }
  };

  const updateConducta = async (id, conducta) => {
    try {
      const data = await conductaService.updateConducta(id, conducta);
      dispatch({ type: UPDATE_CONDUCTA, payload: data });
    } catch (error) {
      dispatch({ type: CONDUCTA_ERROR, payload: error.message });
    }
  };

  const deleteConducta = async (id) => {
    try {
      await conductaService.deleteConducta(id);
      dispatch({ type: DELETE_CONDUCTA, payload: id });
    } catch (error) {
      dispatch({ type: CONDUCTA_ERROR, payload: error.message });
    }
  };

  return (
    <ConductaContext.Provider value={{
      conductas: state.conductas, conductasAlumno: state.conductasAlumno,
      estadisticas: state.estadisticas, error: state.error, loading: state.loading,
      getConductas, getConductasAlumno, addConducta, updateConducta, deleteConducta
    }}>
      {children}
    </ConductaContext.Provider>
  );
};

export default ConductaState;
