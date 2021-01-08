import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Auth } from './pages/AuthPage';
import { MainPage } from './pages/MainPage';
// import { useAuthContext } from './hooks/AuthContext/AuthProvider';

export const useRoutes = (isAuth) => {
    return (
        <Container>
            <Route path='/auth' component={Auth} />
            <Route path='/main' component={MainPage} />
            {isAuth == true ?
                <Redirect to='/main'/> :
                <Redirect to='/auth'/> 
            }
        </Container>
    );
}
