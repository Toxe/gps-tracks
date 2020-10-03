import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens } from "../test/sampleAuthTokens";
import { AuthProvider } from "../auth/AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../auth/API";
import { sampleTracks } from "../test/sampleTracks";
import { sampleUser } from "../test/sampleUsers";
import App from "../app/App";

jest.mock("axios");

describe("AllTracks", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing tracks", () => {
        test("When given sample tracks, should show list of 5 tracks", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByText("Track 21");
            await findByText("Track 28");
            await findByText("Track 47");
            await findByText("Track 85");
            await findByText("Track 87");
        });
    });

    describe("Without tracks", () => {
        test('When given no tracks, should show "No tracks found" message', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get.mockResolvedValueOnce({ data: sampleUser(1) }).mockResolvedValueOnce({ data: [] });

            const { findByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByText("No tracks found.");
        });
    });
});
