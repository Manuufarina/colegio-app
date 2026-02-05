import React, { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_ERRORS,
  SET_LOADING
} from '../types';
import { auth, db } from '../../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const authReducer = (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return { ...state, isAuthenticated: true, loading: false, user: action.payload };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return { ...state, isAuthenticated: true, loading: false, user: action.payload };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT:
      return { ...state, isAuthenticated: false, loading: false, user: null, error: action.payload || null };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    case SET_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};

const AuthState = ({ children }) => {
  const initialState = {
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          const userData = userDoc.exists()
            ? { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() }
            : { uid: firebaseUser.uid, email: firebaseUser.email, rol: 'profesor' };
          dispatch({ type: USER_LOADED, payload: userData });
        } catch {
          dispatch({ type: USER_LOADED, payload: { uid: firebaseUser.uid, email: firebaseUser.email, rol: 'profesor' } });
        }
      } else {
        dispatch({ type: AUTH_ERROR });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: SET_LOADING });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'usuarios', cred.user.uid));
      const userData = userDoc.exists()
        ? { uid: cred.user.uid, email: cred.user.email, ...userDoc.data() }
        : { uid: cred.user.uid, email: cred.user.email, rol: 'profesor' };
      dispatch({ type: LOGIN_SUCCESS, payload: userData });
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error.message });
    }
  };

  const register = async (formData) => {
    dispatch({ type: SET_LOADING });
    try {
      const { email, password, nombre, apellido, rol } = formData;
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        nombre,
        apellido,
        email,
        rol: rol || 'profesor',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'usuarios', cred.user.uid), userData);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { uid: cred.user.uid, ...userData }
      });
    } catch (error) {
      dispatch({ type: REGISTER_FAIL, payload: error.message });
    }
  };

  const logout = async () => {
    await signOut(auth);
    dispatch({ type: LOGOUT });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        login,
        register,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
