import axios from "axios";

export class Auth {
    static async login(credentials) {
        if (!credentials || "email" in credentials === false || "password" in credentials === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.post("/auth/login", credentials);
        return { access_token: response.data.access_token, refresh_token: response.data.refresh_token };
    }

    static async refresh(refresh_token) {
        if (!refresh_token) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.post("/auth/refresh", null, {
            headers: { Authorization: `Bearer ${refresh_token}` },
        });

        return response.data.access_token;
    }

    static prepareLogoutCalls(refresh_token) {
        if (!refresh_token) {
            throw new TypeError("invalid arguments");
        }

        const logout1 = axios.delete("/auth/logout");
        const logout2 = axios.delete("/auth/logout2", {
            headers: { Authorization: `Bearer ${refresh_token}` },
        });

        return [logout1, logout2];
    }
}
