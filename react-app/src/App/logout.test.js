import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../test";
import { AuthProvider } from "../Auth";
import { Auth, TokenStorage } from "../Auth/api";
import { Users } from "./AuthenticatedApp/api";
import { App } from ".";

describe("Logout from the application", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        TokenStorage.clearTokens();
    });

    describe("With authenticated user", () => {
        test('When click on "Logout" button, logout and navigate to login page', async () => {
            TokenStorage.saveTokens(sampleAuthTokens(1));

            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());
            jest.spyOn(Auth, "prepareLogoutCalls").mockReturnValueOnce([Promise.resolve(), Promise.resolve()]);

            const { findByRole, findByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            // open user menu and click on "Logout"
            userEvent.click(await findByRole("button", { name: "User #1" }));
            userEvent.click(await findByText("Logout"));

            // wait for Login page
            await findByRole("heading", { name: "Sign in" });

            // access and refresh tokens should have been removed from local storage
            expect(TokenStorage.getTokens()).toEqual({ access_token: null, refresh_token: null });
        });
    });
});
