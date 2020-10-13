import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens } from "../test";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../Auth";
import { App } from ".";

describe("App", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show AuthenticatedApp", () => {
            saveAuthTokensToLocalStorage(sampleAuthTokens(1));

            const { getByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            getByRole("button", { name: "Upload" });
        });
    });

    describe("Without authenticated user", () => {
        test("When user is not logged in, show UnauthenticatedApp", () => {
            const { getByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            getByRole("button", { name: "Sign in" });
        });
    });
});
