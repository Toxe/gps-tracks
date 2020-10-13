import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { Auth } from "./api/Auth";
import { AuthProvider, useAuth } from ".";

describe("AuthProvider", () => {
    describe("useAuth()", () => {
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
});
