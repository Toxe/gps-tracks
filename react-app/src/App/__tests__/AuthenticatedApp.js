import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import jwt from "jsonwebtoken";
import { AuthProvider } from "../../Auth/AuthProvider";
import App from "../App";

it("renders", () => {
    localStorage.setItem("access_token", jwt.sign({ identity: 99 }, "secret"));
    localStorage.setItem("refresh_token", jwt.sign({ identity: 99 }, "secret"));

    const { getByRole } = render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );

    getByRole("button", { name: "Upload" });
});
