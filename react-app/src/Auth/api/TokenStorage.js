export class TokenStorage {
    static saveTokens(tokens) {
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
    }

    static clearTokens() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    static getTokens() {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        return { access_token, refresh_token };
    }

    static getAccessToken() {
        return localStorage.getItem("access_token");
    }

    static getRefreshToken() {
        return localStorage.getItem("refresh_token");
    }
}
