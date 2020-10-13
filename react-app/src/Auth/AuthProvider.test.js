import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens } from "../test";
import { Auth, TokenStorage } from "./api";
import { AuthProvider, useAuth } from ".";

describe("useAuth()", () => {
    afterEach(() => {
        TokenStorage.clearTokens();
    });

    describe("Basic functionality", () => {
        test("When calling useAuth() outside of an AuthProvider, throw error", () => {
            const { result } = renderHook(() => useAuth());
            expect(result.error).toEqual(new Error("useAuth must be used within an AuthProvider"));
        });

        test("When calling useAuth() without existing auth tokens in local storage, authId should be null", () => {
            const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.authId).toBeNull();
        });
    });

    describe("Login", () => {
        test("When login successful, store auth tokens in local storage and authId should be the user id", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            jest.spyOn(Auth, "login").mockReturnValueOnce({ access_token, refresh_token });

            const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
            const { result } = renderHook(() => useAuth(), { wrapper });

            await act(() => result.current.login({ email: "user@example.com", password: "password" }));

            expect(result.current.authId).toBe(1);
            expect(TokenStorage.getTokens()).toEqual({ access_token, refresh_token });
        });

        test("When credentials are null, throw error and don't log in", async () => {
            const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.login(null)).rejects.toThrow(new TypeError("invalid arguments"));

            expect(result.current.authId).toBeNull();
            expect(TokenStorage.getTokens()).toEqual({ access_token: null, refresh_token: null });
        });

        test("When credentials are incomplete, throw error and don't log in", async () => {
            const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
            const { result } = renderHook(() => useAuth(), { wrapper });

            await expect(result.current.login({ password: "password" })).rejects.toThrow(
                new TypeError("invalid arguments")
            );

            expect(result.current.authId).toBeNull();
            expect(TokenStorage.getTokens()).toEqual({ access_token: null, refresh_token: null });
        });
    });

    describe("Logout", () => {
        test("When logout successful, authId should be null and auth tokens removed from local storage", async () => {
            TokenStorage.saveTokens(sampleAuthTokens(1));

            jest.spyOn(Auth, "prepareLogoutCalls").mockReturnValueOnce([Promise.resolve(), Promise.resolve()]);

            const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.authId).toBe(1);

            await act(() => result.current.logout());

            expect(result.current.authId).toBeNull();
            expect(TokenStorage.getTokens()).toEqual({ access_token: null, refresh_token: null });
        });
    });
});
