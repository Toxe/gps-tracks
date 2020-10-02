import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import LoginForm from "./LoginForm";

function setupEmptyLoginForm() {
    const handleLogin = jest.fn();

    const { getByRole, getByLabelText } = render(<LoginForm handleLogin={handleLogin} />);

    const passwordTextbox = getByLabelText(/Password/i);
    const emailTextbox = getByRole("textbox", { name: /Email Address/i });
    const loginButton = getByRole("button", { name: /Sign in/i });

    userEvent.clear(emailTextbox);
    userEvent.clear(passwordTextbox);

    return { emailTextbox, passwordTextbox, loginButton, handleLogin };
}

describe("LoginForm", () => {
    describe("With all input fields filled", () => {
        test("When all input fields are filled out, sign-in button should be enabled", () => {
            const { emailTextbox, passwordTextbox, loginButton } = setupEmptyLoginForm();

            userEvent.type(emailTextbox, "user@example.com");
            userEvent.type(passwordTextbox, "password");

            expect(loginButton).toBeEnabled();
        });

        test("When sign-in button clicked, call handleLogin", () => {
            const { emailTextbox, passwordTextbox, loginButton, handleLogin } = setupEmptyLoginForm();

            userEvent.type(emailTextbox, "user@example.com");
            userEvent.type(passwordTextbox, "password");
            userEvent.click(loginButton);

            expect(handleLogin).toHaveBeenCalledTimes(1);
            expect(handleLogin).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });
        });
    });

    describe("With one or more input fields empty", () => {
        test("When all login fields are empty, sign-in button should be disabled", () => {
            const { loginButton } = setupEmptyLoginForm();

            expect(loginButton).toBeDisabled();
        });

        test("When email field is empty, sign-in button should be disabled", () => {
            const { emailTextbox, loginButton } = setupEmptyLoginForm();

            userEvent.type(emailTextbox, "user@example.com");

            expect(loginButton).toBeDisabled();
        });

        test("When password field is empty, sign-in button should be disabled", () => {
            const { passwordTextbox, loginButton } = setupEmptyLoginForm();

            userEvent.type(passwordTextbox, "user@example.com");

            expect(loginButton).toBeDisabled();
        });
    });
});
