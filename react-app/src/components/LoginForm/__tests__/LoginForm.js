import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { AuthProvider } from "../../../Auth/AuthProvider";
import LoginForm from "../LoginForm";

function setupLoginForm() {
    const { getByRole, getByLabelText } = render(
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );

    const passwordTextbox = getByLabelText(/Password/i);
    const emailTextbox = getByRole("textbox", { name: /Email Address/i });
    const loginButton = getByRole("button", { name: /Sign in/i });

    return { emailTextbox, passwordTextbox, loginButton };
}

describe("LoginForm", () => {
    describe("With all input fields filled", () => {
        test("When all input fields are filled out, sign-in button should be enabled", () => {
            const { emailTextbox, passwordTextbox, loginButton } = setupLoginForm();

            userEvent.clear(emailTextbox);
            userEvent.type(emailTextbox, "user@example.com");

            userEvent.clear(passwordTextbox);
            userEvent.type(passwordTextbox, "password");

            expect(loginButton).toBeEnabled();
        });
    });

    describe("With one or more input fields empty", () => {
        test("When all login fields are empty, sign-in button should be disabled", () => {
            const { emailTextbox, passwordTextbox, loginButton } = setupLoginForm();

            userEvent.clear(emailTextbox);
            userEvent.clear(passwordTextbox);

            expect(loginButton).toBeDisabled();
        });

        test("When email field is empty, sign-in button should be disabled", () => {
            const { emailTextbox, passwordTextbox, loginButton } = setupLoginForm();

            userEvent.clear(emailTextbox);
            userEvent.clear(passwordTextbox);
            userEvent.type(emailTextbox, "user@example.com");

            expect(loginButton).toBeDisabled();
        });

        test("When password field is empty, sign-in button should be disabled", () => {
            const { emailTextbox, passwordTextbox, loginButton } = setupLoginForm();

            userEvent.clear(emailTextbox);
            userEvent.clear(passwordTextbox);
            userEvent.type(passwordTextbox, "user@example.com");

            expect(loginButton).toBeDisabled();
        });
    });
});
