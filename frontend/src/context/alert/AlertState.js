import React, { useReducer } from 'react';
import AlertContext from './AlertContext';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const alertReducer = (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, []);

  const setAlert = (msg, type, timeout = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: SET_ALERT, payload: { msg, type, id } });
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider value={{ alerts: state, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
