import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { addResponseInterceptor, removeResponseInterceptor } from "./ResponseInterceptor";
import { TokenDecodeError } from "./errors";
import { Auth, TokenStorage } from "./api";

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
            const id = initFromTokens(TokenStorage.getTokens());
            addResponseInterceptor(refresh);
            setAuthId(id);
        } catch (error) {}
    }, [setAuthId]);

    const login = async (credentials) => {
        const tokens = await Auth.login(credentials);
        const id = initFromTokens(tokens);
        addResponseInterceptor(refresh);
        setAuthId(id);
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
        const refresh_token = TokenStorage.getRefreshToken();
        const access_token = await Auth.refresh(refresh_token);

        TokenStorage.saveTokens({ access_token, refresh_token });
        axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

        return access_token;
    };

    return <AuthContext.Provider value={{ authId, login, logout, refresh }}>{children}</AuthContext.Provider>;
}

function initFromTokens(tokens) {
    let identity = undefined;

    try {
        const access_token_data = jwt.decode(tokens.access_token);
        const refresh_token_data = jwt.decode(tokens.refresh_token);

        if (access_token_data === null || refresh_token_data === null)
            throw new TokenDecodeError("Unable to decode token");

        identity = access_token_data.identity;
    } catch (err) {
        throw new TokenDecodeError("Unable to decode token");
    }

    TokenStorage.saveTokens(tokens);
    axios.defaults.headers["Authorization"] = `Bearer ${tokens.access_token}`;

    return identity;
}
