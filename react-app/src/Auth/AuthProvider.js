import React, { useState, useEffect, useContext } from "react";
import { authLogout, authRefresh, authInit, getAuthTokensFromLocalStorage } from "./API";
import { Auth } from "./api/Auth";

const AuthContext = React.createContext();

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export function AuthProvider({ children }) {
    const [authId, setAuthId] = useState(null);

    useEffect(() => {
        try {
            // init auth from already existing tokens
            const tokens = getAuthTokensFromLocalStorage();
            setAuthId(authInit(tokens.access_token, tokens.refresh_token));
        } catch (error) {}
    }, [setAuthId]);

    const login = async (credentials) => {
        const { access_token, refresh_token } = await Auth.login(credentials);
        setAuthId(authInit(access_token, refresh_token));
    };

    const logout = async () => {
        // no matter what happens, always "logout" locally first
        setAuthId(null);
        await authLogout();
    };

    const refresh = async () => {
        await authRefresh();
    };

    return <AuthContext.Provider value={{ authId, login, logout, refresh }}>{children}</AuthContext.Provider>;
}
