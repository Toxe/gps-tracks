import axios from "axios";
import jwt from "jsonwebtoken";
import { TokenDecodeError } from "./errors";
import { addResponseInterceptor } from "./ResponseInterceptor";
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

export async function authRefresh() {
    const refresh_token = TokenStorage.getRefreshToken();
    const access_token = await Auth.refresh(refresh_token);

    TokenStorage.saveTokens({ access_token, refresh_token });
    axios.defaults.headers["Authorization"] = `Bearer ${access_token}`;
}
