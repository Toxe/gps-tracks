import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../test";
import {
    AuthProvider,
    saveAuthTokensToLocalStorage,
    removeAuthTokensFromLocalStorage,
    getAuthTokensFromLocalStorage,
} from "../Auth";
import { Auth } from "../Auth/api/Auth";
import { Users } from "./AuthenticatedApp/api";
import { App } from ".";

describe("Logout from the application", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test('When click on "Logout" button, logout and navigate to login page', async () => {
            saveAuthTokensToLocalStorage(sampleAuthTokens(1));

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
            expect(getAuthTokensFromLocalStorage()).toEqual({ access_token: null, refresh_token: null });
        });
    });
});
