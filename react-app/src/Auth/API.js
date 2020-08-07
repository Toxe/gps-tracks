import axios from "axios";
import jwt from "jsonwebtoken";
import { TokenDecodeError } from "../Errors";
import { addResponseInterceptor, removeResponseInterceptor } from "./ResponseInterceptor";

export function initAuth(access_token, refresh_token) {
    let identity = null;

    try {
        const access_token_data = jwt.decode(access_token);
        const refresh_token_data = jwt.decode(refresh_token);

        if (access_token_data === null || refresh_token_data === null)
            throw new TokenDecodeError("Unable to decode token");

        identity = access_token_data.identity;
    } catch (err) {
        throw new TokenDecodeError("Unable to decode token");
    }

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

    addResponseInterceptor(refresh);

    return identity;
}

export async function login(credentials) {
    const response = await axios.post("/auth/login", credentials);
    return initAuth(response.data.access_token, response.data.refresh_token);
}

export async function logout() {
    // remove interceptor first to not resend logout requests with expired access tokens
    removeResponseInterceptor();

    // prepare logout calls
    const logout1 = axios.delete("/auth/logout");
    const logout2 = axios.delete("/auth/logout2", {
        headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` },
    });

    // no matter what happens, always "logout" locally first
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers["Authorization"];

    try {
        await axios.all([logout1, logout2]);
    } catch (error) {
        // ignore "401 Token has expired" responses because the access token may already have expired
        if (!(error.response.status === 401 && error.response.data.error === "Token has expired"))
            throw error;
    }
}

export async function refresh() {
    const response = await axios.post("/auth/refresh", null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` },
    });

    localStorage.setItem("access_token", response.data.access_token);
    axios.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;

    return response.data.access_token;
}
