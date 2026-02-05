import React, { useReducer } from 'react';
import AlumnoContext from './AlumnoContext';
import {
  GET_ALUMNOS, GET_ALUMNO, ADD_ALUMNO, UPDATE_ALUMNO,
  DELETE_ALUMNO, ALUMNO_ERROR, CLEAR_ALUMNO, FILTER_ALUMNOS, CLEAR_FILTER
} from '../types';
import * as alumnoService from '../../services/alumnoService';

const alumnoReducer = (state, action) => {
  switch (action.type) {
    case GET_ALUMNOS:
      return { ...state, alumnos: action.payload, loading: false };
    case GET_ALUMNO:
      return { ...state, alumno: action.payload, loading: false };
    case ADD_ALUMNO:
      return { ...state, alumnos: [action.payload, ...state.alumnos], loading: false };
    case UPDATE_ALUMNO:
      return {
        ...state,
        alumnos: state.alumnos.map(a => a.id === action.payload.id ? action.payload : a),
        loading: false
      };
    case DELETE_ALUMNO:
      return {
        ...state,
        alumnos: state.alumnos.filter(a => a.id !== action.payload),
        loading: false
      };
    case FILTER_ALUMNOS:
      return {
        ...state,
        filtered: state.alumnos.filter(a => {
          const regex = new RegExp(action.payload, 'gi');
          return a.nombre.match(regex) || a.apellido.match(regex) || (a.documento && a.documento.match(regex));
        })
      };
    case CLEAR_FILTER:
      return { ...state, filtered: null };
    case CLEAR_ALUMNO:
      return { ...state, alumno: null };
    case ALUMNO_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AlumnoState = ({ children }) => {
  const initialState = {
    alumnos: [],
    alumno: null,
    filtered: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(alumnoReducer, initialState);

  const getAlumnos = async () => {
    try {
      const data = await alumnoService.getAlumnos();
      dispatch({ type: GET_ALUMNOS, payload: data });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const getAlumno = async (id) => {
    try {
      const data = await alumnoService.getAlumno(id);
      dispatch({ type: GET_ALUMNO, payload: data });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const getAlumnosByCurso = async (cursoId) => {
    try {
      const data = await alumnoService.getAlumnosByCurso(cursoId);
      dispatch({ type: GET_ALUMNOS, payload: data });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const addAlumno = async (alumno) => {
    try {
      const data = await alumnoService.addAlumno(alumno);
      dispatch({ type: ADD_ALUMNO, payload: data });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const updateAlumno = async (id, alumno) => {
    try {
      const data = await alumnoService.updateAlumno(id, alumno);
      dispatch({ type: UPDATE_ALUMNO, payload: data });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const deleteAlumno = async (id) => {
    try {
      await alumnoService.deleteAlumno(id);
      dispatch({ type: DELETE_ALUMNO, payload: id });
    } catch (error) {
      dispatch({ type: ALUMNO_ERROR, payload: error.message });
    }
  };

  const filterAlumnos = (text) => dispatch({ type: FILTER_ALUMNOS, payload: text });
  const clearFilter = () => dispatch({ type: CLEAR_FILTER });
  const clearAlumno = () => dispatch({ type: CLEAR_ALUMNO });

  return (
    <AlumnoContext.Provider
      value={{
        alumnos: state.alumnos,
        alumno: state.alumno,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getAlumnos,
        getAlumno,
        getAlumnosByCurso,
        addAlumno,
        updateAlumno,
        deleteAlumno,
        filterAlumnos,
        clearFilter,
        clearAlumno
      }}
    >
      {children}
    </AlumnoContext.Provider>
  );
};

export default AlumnoState;
