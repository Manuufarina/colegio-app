import React, { useReducer } from 'react';
import EventoContext from './EventoContext';
import { GET_EVENTOS, ADD_EVENTO, UPDATE_EVENTO, DELETE_EVENTO, EVENTO_ERROR } from '../types';
import * as eventoService from '../../services/eventoService';

const eventoReducer = (state, action) => {
  switch (action.type) {
    case GET_EVENTOS:
      return { ...state, eventos: action.payload, loading: false };
    case ADD_EVENTO:
      return { ...state, eventos: [...state.eventos, action.payload], loading: false };
    case UPDATE_EVENTO:
      return { ...state, eventos: state.eventos.map(e => e.id === action.payload.id ? action.payload : e), loading: false };
    case DELETE_EVENTO:
      return { ...state, eventos: state.eventos.filter(e => e.id !== action.payload), loading: false };
    case EVENTO_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const EventoState = ({ children }) => {
  const [state, dispatch] = useReducer(eventoReducer, {
    eventos: [], error: null, loading: true
  });

  const getEventos = async () => {
    try {
      const data = await eventoService.getEventos();
      dispatch({ type: GET_EVENTOS, payload: data });
    } catch (error) {
      dispatch({ type: EVENTO_ERROR, payload: error.message });
    }
  };

  const addEvento = async (evento) => {
    try {
      const data = await eventoService.addEvento(evento);
      dispatch({ type: ADD_EVENTO, payload: data });
    } catch (error) {
      dispatch({ type: EVENTO_ERROR, payload: error.message });
    }
  };

  const updateEvento = async (id, evento) => {
    try {
      const data = await eventoService.updateEvento(id, evento);
      dispatch({ type: UPDATE_EVENTO, payload: data });
    } catch (error) {
      dispatch({ type: EVENTO_ERROR, payload: error.message });
    }
  };

  const deleteEvento = async (id) => {
    try {
      await eventoService.deleteEvento(id);
      dispatch({ type: DELETE_EVENTO, payload: id });
    } catch (error) {
      dispatch({ type: EVENTO_ERROR, payload: error.message });
    }
  };

  return (
    <EventoContext.Provider value={{
      eventos: state.eventos, error: state.error, loading: state.loading,
      getEventos, addEvento, updateEvento, deleteEvento
    }}>
      {children}
    </EventoContext.Provider>
  );
};

export default EventoState;
