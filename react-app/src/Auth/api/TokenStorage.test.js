import { TokenStorage } from ".";
import { sampleAuthTokens } from "../../test";

describe("TokenStorage", () => {
    afterEach(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    });

    describe("Saving tokens", () => {
        test("When saving tokens, should write them to local storage", () => {
            const { access_token, refresh_token } = sampleAuthTokens();

            TokenStorage.saveTokens({ access_token, refresh_token });

            expect(localStorage.getItem("access_token")).toBe(access_token);
            expect(localStorage.getItem("refresh_token")).toBe(refresh_token);
        });
    });

    describe("Clearing tokens", () => {
        test("When clearing tokens, should remove them from local storage", () => {
            const { access_token, refresh_token } = sampleAuthTokens();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            TokenStorage.clearTokens();

            expect(localStorage.getItem("access_token")).toBeNull();
            expect(localStorage.getItem("refresh_token")).toBeNull();
        });
    });

    describe("Get both tokens", () => {
        test("When reading tokens, should return object containing access_token and refresh_token", () => {
            const { access_token, refresh_token } = sampleAuthTokens();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            const tokens = TokenStorage.getTokens();

            expect(tokens).toEqual({ access_token, refresh_token });
        });
    });

    describe("Get access token", () => {
        test("When reading access token, should return access_token", () => {
            const { access_token, refresh_token } = sampleAuthTokens();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            const token = TokenStorage.getAccessToken();

            expect(token).toBe(access_token);
        });
    });

    describe("Get refresh token", () => {
        test("When reading refresh token, should return refresh_token", () => {
            const { access_token, refresh_token } = sampleAuthTokens();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            const token = TokenStorage.getRefreshToken();

            expect(token).toBe(refresh_token);
        });
    });
});
