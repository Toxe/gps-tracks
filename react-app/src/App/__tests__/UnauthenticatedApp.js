import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { AuthProvider } from "../../Auth/AuthProvider";
import App from "../App";

it("renders", () => {
    const { getByRole } = render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );

    getByRole("button", { name: "Sign in" });
});
