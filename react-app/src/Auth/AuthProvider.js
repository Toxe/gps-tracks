import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { removeResponseInterceptor } from "./ResponseInterceptor";
import { authRefresh, authInit } from "./API";
import { Auth } from "./api/Auth";
import { TokenStorage } from "./api/TokenStorage";

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
            const tokens = TokenStorage.getTokens();
            setAuthId(authInit(tokens.access_token, tokens.refresh_token));
        } catch (error) {}
    }, [setAuthId]);

    const login = async (credentials) => {
        const { access_token, refresh_token } = await Auth.login(credentials);
        setAuthId(authInit(access_token, refresh_token));
    };

    const logout = async () => {
        // remove interceptor first to not resend logout requests with expired access tokens
        removeResponseInterceptor();

        // prepare logout calls
        const logoutCalls = Auth.prepareLogoutCalls(TokenStorage.getRefreshToken());

        // no matter what happens, always "logout" locally first by clearing all auth info
        setAuthId(null);
        TokenStorage.clearTokens();
        delete axios.defaults.headers["Authorization"];

        try {
            await Promise.all(logoutCalls);
        } catch (error) {
            // ignore "401 Token has expired" responses because the access token may have already expired
            if (!(error.response.status === 401 && error.response.data.error === "Token has expired")) {
                throw error;
            }
        }
    };

    const refresh = async () => {
        await authRefresh();
    };

    return <AuthContext.Provider value={{ authId, login, logout, refresh }}>{children}</AuthContext.Provider>;
}
