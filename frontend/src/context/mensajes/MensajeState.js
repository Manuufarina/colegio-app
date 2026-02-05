import React, { useReducer } from 'react';
import MensajeContext from './MensajeContext';
import { GET_MENSAJES, GET_CONVERSACION, SEND_MENSAJE, MENSAJE_ERROR } from '../types';
import * as mensajeService from '../../services/mensajeService';

const mensajeReducer = (state, action) => {
  switch (action.type) {
    case GET_MENSAJES:
      return { ...state, conversaciones: action.payload, loading: false };
    case GET_CONVERSACION:
      return { ...state, mensajes: action.payload, loading: false };
    case SEND_MENSAJE:
      return { ...state, mensajes: [...state.mensajes, action.payload], loading: false };
    case MENSAJE_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const MensajeState = ({ children }) => {
  const [state, dispatch] = useReducer(mensajeReducer, {
    conversaciones: [], mensajes: [], error: null, loading: true
  });

  const getMensajes = async (userId) => {
    try {
      const data = await mensajeService.getMensajes(userId);
      dispatch({ type: GET_MENSAJES, payload: data });
    } catch (error) {
      dispatch({ type: MENSAJE_ERROR, payload: error.message });
    }
  };

  const getConversacion = async (conversacionId) => {
    try {
      const data = await mensajeService.getConversacion(conversacionId);
      dispatch({ type: GET_CONVERSACION, payload: data });
    } catch (error) {
      dispatch({ type: MENSAJE_ERROR, payload: error.message });
    }
  };

  const sendMensaje = async (conversacionId, data) => {
    try {
      const msg = await mensajeService.sendMensaje(conversacionId, data);
      dispatch({ type: SEND_MENSAJE, payload: msg });
    } catch (error) {
      dispatch({ type: MENSAJE_ERROR, payload: error.message });
    }
  };

  return (
    <MensajeContext.Provider value={{
      conversaciones: state.conversaciones, mensajes: state.mensajes,
      error: state.error, loading: state.loading,
      getMensajes, getConversacion, sendMensaje
    }}>
      {children}
    </MensajeContext.Provider>
  );
};

export default MensajeState;
