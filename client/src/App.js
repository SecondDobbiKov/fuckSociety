import React, { Component, useContext } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout/index';
import { useRoutes } from './routes'

import './custom.css'
import { useAuthContext } from './hooks/AuthContext/AuthProvider';
import AuthProvider from './hooks/AuthContext/AuthProvider';

export default function App(){
  const {isAuthenticated} = useAuthContext();
  const routes = useRoutes(isAuthenticated);

  return (
      <Layout>
        {routes}
      </Layout>
  );
}

