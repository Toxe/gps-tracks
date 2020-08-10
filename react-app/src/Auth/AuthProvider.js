import React, { useState, useEffect, useContext } from "react";
import { authLogin, authLogout, authRefresh, authInit } from "./API";

const AuthContext = React.createContext();

export function AuthProvider(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // init auth from already existing tokens
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        try {
            const id = authInit(access_token, refresh_token);
            const username = `User #${id}`;
            setUser({ id, username });
        } catch (error) {}
    }, [setUser]);

    const login = async (credentials) => {
        const user = await authLogin(credentials);
        setUser(user);
    };

    const logout = async () => {
        // no matter what happens, always "logout" locally first
        setUser(null);
        await authLogout();
    };

    const refresh = async () => {
        await authRefresh();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refresh }}>
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
