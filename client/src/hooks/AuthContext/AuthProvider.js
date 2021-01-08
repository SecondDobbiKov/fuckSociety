import React, { createContext, useContext } from 'react';
// import { AuthContext } from './AuthContext';
import { useAuth } from './AuthHook';

export const AuthContext = createContext();

export default function AuthProvider({children}) {
    const {login, logout, token} = useAuth();
    const isAuthenticated = !!token;
    return (
        <AuthContext.Provider
            value={{
                login, logout, token, isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}
