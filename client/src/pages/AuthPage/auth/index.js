import React, { Component, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/AuthContext/AuthProvider';
import { request } from '../../../hooks/HttpHook/http.hook';

const ModalAuth = ({page}) => {
    const[isAuth, setIsAuth] = useState(false);
    const authContext = useAuthContext();

    const[login, setLogin] = useState("");
    const[pass, setPass] = useState("");

    const loginChangeHandler = event => {
        setLogin(event.target.value);
    }
    const passChangeHandler = event => {
        setPass(event.target.value);
    }

    const loginHandler = async () => {
        var fd = {
            Login: login,
            Password: pass
        };
        // fd.append('Login', login);
        // fd.append('Password', pass);
        var response = await request('/api/Users/AuthUser', 'POST', {
            'Content-Type': 'application/json'
        }, JSON.stringify(fd));
        var data = await response.json();
        console.log(data);
        authContext.login(data.acces_token);
        setIsAuth(authContext.isAuthenticated);
    }

    if(page == 2)
        return null;
    if(isAuth == true){
        return(
            <Redirect to="/main"/>
        )
    } else{
        return(
                <div>
                    <div className="input">
                        <p>Введите логин:</p>
                        <input type="input" value={login} onChange={loginChangeHandler}/>
                    </div>
                    <div className="input">
                        <p>Введите пароль:</p>
                        <input type="password" value={pass} onChange={passChangeHandler}/>
                    </div>
                    <div className="button-area">
                        <div className="button-a"><a onClick={loginHandler}>Авторизоватся</a></div>
                    </div>
                </div>
        )
    }
}

export default ModalAuth;

