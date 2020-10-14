import React from "react";
import "../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../test";
import { AuthProvider } from "../Auth";
import { Auth, TokenStorage } from "../Auth/api";
import { Users } from "./AuthenticatedApp/api";
import { App } from ".";

describe("Login into the application", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        TokenStorage.clearTokens();
    });

    describe("Without authenticated user", () => {
        test("When login successful, show main page", async () => {
            const user = sampleUser(1);

            const authLoginSpy = jest.spyOn(Auth, "login").mockReturnValueOnce(sampleAuthTokens(1));
            const usersGetSpy = jest.spyOn(Users, "get").mockReturnValueOnce(user);
            const usersTracksSpy = jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());

            const { getByRole, getByLabelText, findByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            const passwordTextbox = getByLabelText(/Password/i);
            const emailTextbox = getByRole("textbox", { name: /Email Address/i });
            const loginButton = getByRole("button", { name: /Sign in/i });

            // enter email and password
            userEvent.clear(emailTextbox);
            userEvent.type(emailTextbox, "user@example.com");

            userEvent.clear(passwordTextbox);
            userEvent.type(passwordTextbox, "password");

            // login
            userEvent.click(loginButton);

            await waitFor(() => expect(authLoginSpy).toHaveBeenCalledTimes(1));
            expect(authLoginSpy).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });

            await waitFor(() => expect(usersGetSpy).toHaveBeenCalledTimes(1));
            expect(usersGetSpy).toHaveBeenCalledWith(1);

            await waitFor(() => expect(usersTracksSpy).toHaveBeenCalledTimes(1));
            expect(usersTracksSpy).toHaveBeenCalledWith(user);

            // when logged-in we should see an "Upload" button and the user menu
            await findByRole("button", { name: "Upload" });
            await findByRole("button", { name: "User #1" });
        });
    });
});
