import React, { useReducer } from 'react';
import CursoContext from './CursoContext';
import { GET_CURSOS, GET_CURSO, ADD_CURSO, UPDATE_CURSO, DELETE_CURSO, CURSO_ERROR } from '../types';
import * as cursoService from '../../services/cursoService';

const cursoReducer = (state, action) => {
  switch (action.type) {
    case GET_CURSOS:
      return { ...state, cursos: action.payload, loading: false };
    case GET_CURSO:
      return { ...state, curso: action.payload, loading: false };
    case ADD_CURSO:
      return { ...state, cursos: [...state.cursos, action.payload], loading: false };
    case UPDATE_CURSO:
      return { ...state, cursos: state.cursos.map(c => c.id === action.payload.id ? action.payload : c), loading: false };
    case DELETE_CURSO:
      return { ...state, cursos: state.cursos.filter(c => c.id !== action.payload), loading: false };
    case CURSO_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const CursoState = ({ children }) => {
  const [state, dispatch] = useReducer(cursoReducer, {
    cursos: [], curso: null, error: null, loading: true
  });

  const getCursos = async () => {
    try {
      const data = await cursoService.getCursos();
      dispatch({ type: GET_CURSOS, payload: data });
    } catch (error) {
      dispatch({ type: CURSO_ERROR, payload: error.message });
    }
  };

  const getCurso = async (id) => {
    try {
      const data = await cursoService.getCurso(id);
      dispatch({ type: GET_CURSO, payload: data });
    } catch (error) {
      dispatch({ type: CURSO_ERROR, payload: error.message });
    }
  };

  const addCurso = async (curso) => {
    try {
      const data = await cursoService.addCurso(curso);
      dispatch({ type: ADD_CURSO, payload: data });
    } catch (error) {
      dispatch({ type: CURSO_ERROR, payload: error.message });
    }
  };

  const updateCurso = async (id, curso) => {
    try {
      const data = await cursoService.updateCurso(id, curso);
      dispatch({ type: UPDATE_CURSO, payload: data });
    } catch (error) {
      dispatch({ type: CURSO_ERROR, payload: error.message });
    }
  };

  const deleteCurso = async (id) => {
    try {
      await cursoService.deleteCurso(id);
      dispatch({ type: DELETE_CURSO, payload: id });
    } catch (error) {
      dispatch({ type: CURSO_ERROR, payload: error.message });
    }
  };

  return (
    <CursoContext.Provider value={{
      cursos: state.cursos, curso: state.curso, error: state.error, loading: state.loading,
      getCursos, getCurso, addCurso, updateCurso, deleteCurso
    }}>
      {children}
    </CursoContext.Provider>
  );
};

export default CursoState;
