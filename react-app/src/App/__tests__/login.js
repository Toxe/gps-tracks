import React from "react";
import "../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import jwt from "jsonwebtoken";
import axiosMock from "axios";
import { sampleTracks } from "../../test/sampleTracks";
import { AuthProvider } from "../../Auth/AuthProvider";
import App from "../App";

jest.mock("axios");

describe("Login into the application", () => {
    describe("Without authenticated user", () => {
        test("When login successful, show main page", async () => {
            axiosMock.post.mockResolvedValueOnce({
                data: {
                    access_token: jwt.sign({ identity: 1 }, "secret", { expiresIn: "15m" }),
                    refresh_token: jwt.sign({ identity: 1 }, "secret", { expiresIn: "30d" }),
                },
            });

            axiosMock.get
                .mockResolvedValueOnce({
                    data: {
                        id: 1,
                        links: {
                            gpxfiles: "/api/users/1/gpxfiles",
                            tracks: "/api/users/1/tracks",
                        },
                        username: "Username",
                    },
                })
                .mockResolvedValueOnce({
                    data: sampleTracks(),
                });

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
            await findByRole("button", { name: "Username" });
        });
    });
});
