import React, { useState, useEffect, useContext } from "react";
import { login, logout, refresh, initAuth } from "./API";

const AuthContext = React.createContext();

export function AuthProvider(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // init auth from already existing tokens
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        try {
            const id = initAuth(access_token, refresh_token);
            const username = `User #${id}`;
            setUser({ id, username });
        } catch (error) {}
    }, [setUser]);

    const handleLogin = async (credentials) => {
        const user = await login(credentials);
        setUser(user);
    };

    const handleLogout = async () => {
        // no matter what happens, always "logout" locally first
        setUser(null);
        await logout();
    };

    const handleRefresh = async () => {
        await refresh();
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, handleRefresh }}>
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
