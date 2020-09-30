import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import jwt from "jsonwebtoken";
import { AuthProvider } from "../../Auth/AuthProvider";
import App from "../App";

describe("App", () => {
    afterEach(() => {
        localStorage.clear();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show AuthenticatedApp", () => {
            const identity = 1;
            const access_token = jwt.sign({ identity }, "secret", { expiresIn: "15m" });
            const refresh_token = jwt.sign({ identity }, "secret", { expiresIn: "30d" });

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

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
