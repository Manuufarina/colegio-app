import React, { useReducer } from 'react';
import NotificacionContext from './NotificacionContext';
import { GET_NOTIFICACIONES, MARK_READ, NOTIFICACION_ERROR } from '../types';
import * as notificacionService from '../../services/notificacionService';

const notificacionReducer = (state, action) => {
  switch (action.type) {
    case GET_NOTIFICACIONES:
      return { ...state, notificaciones: action.payload, loading: false };
    case MARK_READ:
      return {
        ...state,
        notificaciones: state.notificaciones.map(n =>
          n.id === action.payload ? { ...n, leida: true } : n
        ),
        loading: false
      };
    case NOTIFICACION_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const NotificacionState = ({ children }) => {
  const [state, dispatch] = useReducer(notificacionReducer, {
    notificaciones: [], error: null, loading: true
  });

  const getNotificaciones = async (userId) => {
    try {
      const data = await notificacionService.getNotificaciones(userId);
      dispatch({ type: GET_NOTIFICACIONES, payload: data });
    } catch (error) {
      dispatch({ type: NOTIFICACION_ERROR, payload: error.message });
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificacionService.markAsRead(id);
      dispatch({ type: MARK_READ, payload: id });
    } catch (error) {
      dispatch({ type: NOTIFICACION_ERROR, payload: error.message });
    }
  };

  const markAllAsRead = async (userId) => {
    try {
      await notificacionService.markAllAsRead(userId);
      const data = await notificacionService.getNotificaciones(userId);
      dispatch({ type: GET_NOTIFICACIONES, payload: data });
    } catch (error) {
      dispatch({ type: NOTIFICACION_ERROR, payload: error.message });
    }
  };

  return (
    <NotificacionContext.Provider value={{
      notificaciones: state.notificaciones, error: state.error, loading: state.loading,
      getNotificaciones, markAsRead, markAllAsRead
    }}>
      {children}
    </NotificacionContext.Provider>
  );
};

export default NotificacionState;
