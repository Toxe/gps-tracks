import React from "react";
import "../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../test";
import { AuthProvider, removeAuthTokensFromLocalStorage } from "../Auth";
import { App } from ".";

jest.mock("axios");

describe("Login into the application", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("Without authenticated user", () => {
        test("When login successful, show main page", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);

            axiosMock.post.mockResolvedValueOnce({
                data: { access_token, refresh_token },
            });

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

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

            await waitFor(() => expect(axiosMock.post).toHaveBeenCalledTimes(1));
            expect(axiosMock.post).toHaveBeenCalledWith("/auth/login", {
                email: "user@example.com",
                password: "password",
            });

            await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(2));
            expect(axiosMock.get).toHaveBeenNthCalledWith(1, "/api/users/1");
            expect(axiosMock.get).toHaveBeenNthCalledWith(2, "/api/users/1/tracks");

            // when logged-in we should see an "Upload" button and the user menu
            await findByRole("button", { name: "Upload" });
            await findByRole("button", { name: "User #1" });
        });
    });
});
