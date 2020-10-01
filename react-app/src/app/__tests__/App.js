import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens } from "../../test/sampleAuthTokens";
import { AuthProvider } from "../../auth/AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../auth/API";
import App from "../App";

describe("App", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show AuthenticatedApp", () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

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
