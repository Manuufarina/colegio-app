import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import Loading from '../layout/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <Loading />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
