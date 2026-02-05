import React, { useReducer } from 'react';
import MateriaContext from './MateriaContext';
import { GET_MATERIAS, ADD_MATERIA, UPDATE_MATERIA, DELETE_MATERIA, MATERIA_ERROR } from '../types';
import * as materiaService from '../../services/materiaService';

const materiaReducer = (state, action) => {
  switch (action.type) {
    case GET_MATERIAS:
      return { ...state, materias: action.payload, loading: false };
    case ADD_MATERIA:
      return { ...state, materias: [...state.materias, action.payload], loading: false };
    case UPDATE_MATERIA:
      return { ...state, materias: state.materias.map(m => m.id === action.payload.id ? action.payload : m), loading: false };
    case DELETE_MATERIA:
      return { ...state, materias: state.materias.filter(m => m.id !== action.payload), loading: false };
    case MATERIA_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const MateriaState = ({ children }) => {
  const [state, dispatch] = useReducer(materiaReducer, {
    materias: [], error: null, loading: true
  });

  const getMaterias = async () => {
    try {
      const data = await materiaService.getMaterias();
      dispatch({ type: GET_MATERIAS, payload: data });
    } catch (error) {
      dispatch({ type: MATERIA_ERROR, payload: error.message });
    }
  };

  const getMateriasByCurso = async (cursoId) => {
    try {
      const data = await materiaService.getMateriasByCurso(cursoId);
      dispatch({ type: GET_MATERIAS, payload: data });
    } catch (error) {
      dispatch({ type: MATERIA_ERROR, payload: error.message });
    }
  };

  const addMateria = async (materia) => {
    try {
      const data = await materiaService.addMateria(materia);
      dispatch({ type: ADD_MATERIA, payload: data });
    } catch (error) {
      dispatch({ type: MATERIA_ERROR, payload: error.message });
    }
  };

  const updateMateria = async (id, materia) => {
    try {
      const data = await materiaService.updateMateria(id, materia);
      dispatch({ type: UPDATE_MATERIA, payload: data });
    } catch (error) {
      dispatch({ type: MATERIA_ERROR, payload: error.message });
    }
  };

  const deleteMateria = async (id) => {
    try {
      await materiaService.deleteMateria(id);
      dispatch({ type: DELETE_MATERIA, payload: id });
    } catch (error) {
      dispatch({ type: MATERIA_ERROR, payload: error.message });
    }
  };

  return (
    <MateriaContext.Provider value={{
      materias: state.materias, error: state.error, loading: state.loading,
      getMaterias, getMateriasByCurso, addMateria, updateMateria, deleteMateria
    }}>
      {children}
    </MateriaContext.Provider>
  );
};

export default MateriaState;
