import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import CurrentUserContext from '../../context/CurrentUserContext';

const ProtectedRoute = () => {
  const { isLoggedIn } = useContext(CurrentUserContext);

  return isLoggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;
