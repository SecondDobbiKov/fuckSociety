import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { useAuthContext } from '../../hooks/AuthContext/AuthProvider';
import { NavMenu } from '../NavMenu/index';

export const Layout = ({children}) => {
  const auth = useAuthContext();
    return (
      <Container>
        {
          auth.isAuthenticated == true ? <NavMenu /> : <div/>
        }
        <Container>
          {children}
        </Container>
      </Container>
    );
}
