import React from "react";
import "../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import jwt from "jsonwebtoken";
import axiosMock from "axios";
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
                    data: [
                        {
                            activity_mode: 1,
                            avg_speed: 3.0769410345863024,
                            gpxfile_id: 1,
                            id: 1,
                            length2d: 117.894318190882,
                            length3d: 118.20254402707839,
                            links: {
                                download: "/api/users/1/gpxfiles/1/download/example.gpx",
                                file: "/api/users/1/gpxfiles/1",
                                owner: "/api/users/1",
                                segments: "/api/users/1/tracks/1/segments",
                                thumbnail: "/thumbnails/9d494b69-cbfd-4c76-975a-0b87217fe9b4.png",
                            },
                            max_speed: 0.0,
                            moving_time: 89.0,
                            stopped_time: 162.0,
                            thumbnail: "9d494b69-cbfd-4c76-975a-0b87217fe9b4",
                            time_end: "2007-10-14T10:14:08",
                            time_start: "2007-10-14T10:09:57",
                            title: "Example gpx",
                            total_downhill: 3.0,
                            total_uphill: 3.0,
                            user_id: 1,
                        },
                        {
                            activity_mode: 1,
                            avg_speed: 3.0769410345863024,
                            gpxfile_id: 2,
                            id: 2,
                            length2d: 117.894318190882,
                            length3d: 118.20254402707839,
                            links: {
                                download: "/api/users/1/gpxfiles/2/download/example.gpx",
                                file: "/api/users/1/gpxfiles/2",
                                owner: "/api/users/1",
                                segments: "/api/users/1/tracks/2/segments",
                                thumbnail: "/thumbnails/3e143f7a-7db4-4236-85cb-8dae09aa9241.png",
                            },
                            max_speed: 0.0,
                            moving_time: 89.0,
                            stopped_time: 162.0,
                            thumbnail: "3e143f7a-7db4-4236-85cb-8dae09aa9241",
                            time_end: "2007-10-14T10:14:08",
                            time_start: "2007-10-14T10:09:57",
                            title: "Example gpx",
                            total_downhill: 3.0,
                            total_uphill: 3.0,
                            user_id: 1,
                        },
                    ],
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
