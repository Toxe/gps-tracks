import React, { useState, useEffect, useContext } from "react";
import { authLogin, authLogout, authRefresh, authInit } from "./API";

const AuthContext = React.createContext();

export function AuthProvider(props) {
    const [authId, setAuthId] = useState(null);

    useEffect(() => {
        // init auth from already existing tokens
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        try {
            setAuthId(authInit(access_token, refresh_token));
        } catch (error) {}
    }, [setAuthId]);

    const login = async (credentials) => {
        const id = await authLogin(credentials);
        setAuthId(id);
        return id;
    };

    const logout = async () => {
        // no matter what happens, always "logout" locally first
        setAuthId(null);
        await authLogout();
    };

    const refresh = async () => {
        await authRefresh();
    };

    return (
        <AuthContext.Provider value={{ authId, login, logout, refresh }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");

    return context;
}
