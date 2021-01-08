import React, { Component, useState } from 'react';
import { request } from '../../../hooks/HttpHook/http.hook';

const ModalRegister = ({page}) => {
    const[login, setLogin] = useState("");
    const[pass, setPass] = useState("");
    const[repeatPass, setRepeatPass] = useState("");

    const loginChangeHandler = event => {
        setLogin(event.target.value);
    }
    const passChangeHandler = event => {
        setPass(event.target.value);
    }
    const repeatPassChangeHandler = event => {
        setRepeatPass(event.target.value);
    }
    const loginHandler = async event => {
        if(pass !== repeatPass || login === "" || pass === "" || repeatPass === "")
            return null;
        var fd = {
            Login: login,
            Password: pass
        };
        var response = await request('/api/Users/Register', 'POST', {
            'Content-Type': 'application/json'
        }, JSON.stringify(fd));
        var data = await response.json();
        console.log(data);
    }

    if(page == 1)
        return null;

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
            <div className="input">
                {pass === repeatPass ? <p>Введите повторно пароль:</p> : <p style={{ color: 'red' }}>Пароли не совпадают!</p>}
                <input type="password" value={repeatPass} onChange={repeatPassChangeHandler}/>
            </div>
            <div className="button-area">
                <div className="button-a"><a onClick={loginHandler}>Авторизоватся</a></div>
            </div>
        </div>
    )
};

export default ModalRegister;
