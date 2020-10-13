import axios from "axios";
import jwt from "jsonwebtoken";
import { TokenDecodeError } from "./errors";
import { addResponseInterceptor, removeResponseInterceptor } from "./ResponseInterceptor";
import { Auth } from "./api/Auth";
import { TokenStorage } from "./api/TokenStorage";

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

    TokenStorage.saveTokens({ access_token, refresh_token });
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;

    addResponseInterceptor(authRefresh);

    return identity;
}

export async function authLogout() {
    // remove interceptor first to not resend logout requests with expired access tokens
    removeResponseInterceptor();

    // prepare logout calls
    const refresh_token = TokenStorage.getRefreshToken();
    const logoutCalls = Auth.prepareLogoutCalls(refresh_token);

    // no matter what happens, always "logout" locally first by clearing all auth info
    TokenStorage.clearTokens();
    delete axios.defaults.headers["Authorization"];

    try {
        await Promise.all(logoutCalls);
    } catch (error) {
        // ignore "401 Token has expired" responses because the access token may already have expired
        if (!(error.response.status === 401 && error.response.data.error === "Token has expired")) {
            throw error;
        }
    }
}

export async function authRefresh() {
    const refresh_token = TokenStorage.getRefreshToken();
    const access_token = await Auth.refresh(refresh_token);

    TokenStorage.saveTokens({ access_token, refresh_token });
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;
}
