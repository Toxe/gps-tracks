import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens } from "../test/sampleAuthTokens";
import { sampleTracks } from "../test/sampleTracks";
import { sampleUser } from "../test/sampleUsers";
import {
    AuthProvider,
    saveAuthTokensToLocalStorage,
    removeAuthTokensFromLocalStorage,
    getAuthTokensFromLocalStorage,
} from "../Auth";
import App from "./App";

jest.mock("axios");

describe("Logout from the application", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test('When click on "Logout" button, logout and navigate to login page', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            axiosMock.delete.mockResolvedValueOnce({}).mockResolvedValueOnce({});

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
