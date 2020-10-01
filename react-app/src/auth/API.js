import axios from "axios";
import jwt from "jsonwebtoken";
import { TokenDecodeError } from "../utils/errors";
import { addResponseInterceptor, removeResponseInterceptor } from "./ResponseInterceptor";

export function saveAuthTokensToLocalStorage(access_token, refresh_token) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
}

export function removeAuthTokensFromLocalStorage() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

export function getAuthTokensFromLocalStorage() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    return { access_token, refresh_token };
}

export function authInit(access_token, refresh_token) {
    let identity = undefined;

    try {
        const access_token_data = jwt.decode(access_token);
        const refresh_token_data = jwt.decode(refresh_token);

        if (access_token_data === null || refresh_token_data === null)
            throw new TokenDecodeError("Unable to decode token");

        identity = access_token_data.identity;
    } catch (err) {
        throw new TokenDecodeError("Unable to decode token");
    }

    saveAuthTokensToLocalStorage(access_token, refresh_token);
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

    addResponseInterceptor(authRefresh);

    return identity;
}

export async function authLogin(credentials) {
    const response = await axios.post("/auth/login", credentials);
    return authInit(response.data.access_token, response.data.refresh_token);
}

export async function authLogout() {
    // remove interceptor first to not resend logout requests with expired access tokens
    removeResponseInterceptor();

    // prepare logout calls
    const { refresh_token } = getAuthTokensFromLocalStorage();
    const logout1 = axios.delete("/auth/logout");
    const logout2 = axios.delete("/auth/logout2", {
        headers: { Authorization: `Bearer ${refresh_token}` },
    });

    // no matter what happens, always "logout" locally first by clearing all auth info
    removeAuthTokensFromLocalStorage();
    delete axios.defaults.headers["Authorization"];

    try {
        await axios.all([logout1, logout2]);
    } catch (error) {
        // ignore "401 Token has expired" responses because the access token may already have expired
        if (!(error.response.status === 401 && error.response.data.error === "Token has expired")) {
            throw error;
        }
    }
}

export async function authRefresh() {
    const { refresh_token } = getAuthTokensFromLocalStorage();

    const response = await axios.post("/auth/refresh", null, {
        headers: { Authorization: `Bearer ${refresh_token}` },
    });

    saveAuthTokensToLocalStorage(response.data.access_token, refresh_token);
    axios.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;

    return response.data.access_token;
}
