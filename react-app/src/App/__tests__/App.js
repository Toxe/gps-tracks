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
            localStorage.setItem("access_token", jwt.sign({ identity: 1 }, "secret"));
            localStorage.setItem("refresh_token", jwt.sign({ identity: 1 }, "secret"));

            const { getByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            getByRole("button", { name: "Upload" });
        });
    });

    describe("With no authenticated user", () => {
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