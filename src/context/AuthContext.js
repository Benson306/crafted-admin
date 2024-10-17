import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }){
    const [token, setToken] = useState(null);


    const login = (user) =>{
        setToken(user);
        localStorage.setItem('token', user)
    }

    const logout = (user)=>{
        setToken(null);
        localStorage.removeItem('token')
    }

    const isLoggedIn = () =>{
        let savedToken = localStorage.getItem('token');

        if(savedToken){
            setToken(savedToken);
        }
    }

    useEffect(()=>{
        isLoggedIn();
    },[])

    return (<AuthContext.Provider  value={{login, logout, token}}>{children}</AuthContext.Provider>)
}