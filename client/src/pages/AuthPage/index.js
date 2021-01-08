import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/AuthContext/AuthProvider';
import ModalAuth from './auth/index'
import ModalRegister  from './register/index'

import './index.css';

const LOGIN_ENUM = 1;
const REGISTER_ENUM = 2;

export const Auth = () => {
    const[page, setPage] = useState(LOGIN_ENUM);

    const topRegButtonClickHandler = () => {
        setPage(REGISTER_ENUM);
    }
    const topAuthButtonClickHandler = () => {
        setPage(LOGIN_ENUM);
    }

    return(
        <div className="auth-page">
            <div className="auth-container">
                {/* top-buttons */}
                <div className="top-buttons">
                    <div className="button">
                        <div className={page == LOGIN_ENUM ? "button-inner button-active" : "button-inner"} onClick={topAuthButtonClickHandler}>
                            <p>Авторизация</p>
                        </div>
                    </div>
                    <div className="button">
                        <div className={page == REGISTER_ENUM ? "button-inner button-active" : "button-inner"} onClick={topRegButtonClickHandler}>
                            <p>Регистрация</p>
                        </div>
                    </div>
                </div>
                {/* modal */}
                <div className="main">
                    <div className="main-inner">
                        <ModalAuth page={page}/>
                        <ModalRegister page={page}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
