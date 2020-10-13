import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens } from "../../test";
import { Auth } from "./Auth";

jest.mock("axios");

describe("Auth API", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("Login", () => {
        test("When called with email and password, return access_token and refresh_token", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            const credentials = { email: "user@example.com", password: "password" };

            axiosMock.post.mockResolvedValueOnce({ status: 200, data: { access_token, refresh_token } });

            const tokens = await Auth.login(credentials);

            expect(axiosMock.post).toHaveBeenCalledWith("/auth/login", credentials);
            expect(tokens).toBeObject();
            expect(tokens).toContainValue(access_token);
            expect(tokens).toContainValue(refresh_token);
        });

        test("When credentials is null, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.login(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When credentials is undefined, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.login(undefined)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When email is missing, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.login({ password: "password" })).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When password is missing, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.login({ email: "user@example.com" })).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Refresh", () => {
        test("When called with refresh_token, return a new access_token", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            axiosMock.post.mockResolvedValueOnce({ status: 200, data: { access_token } });

            const new_access_token = await Auth.refresh(refresh_token);

            expect(new_access_token).toBe(access_token);
        });

        test("When refresh_token is null, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.refresh(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When refresh_token is undefined, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Auth.refresh(undefined)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Logout", () => {
        test("When called with refresh_token, return two pending logout requests", () => {
            const { refresh_token } = sampleAuthTokens(1);
            const logoutCalls = Auth.prepareLogoutCalls(refresh_token);

            expect(logoutCalls).toBeArray();
            expect(logoutCalls).toHaveLength(2);
        });

        test("When refresh_token is null, throw TypeError", () => {
            expect(() => Auth.prepareLogoutCalls(null)).toThrow(new TypeError("invalid arguments"));
        });

        test("When refresh_token is undefined, throw TypeError", () => {
            expect(() => Auth.prepareLogoutCalls(undefined)).toThrow(new TypeError("invalid arguments"));
        });
    });
});
