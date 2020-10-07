import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../../Auth";
import { sampleAuthTokens } from "../../../test/sampleAuthTokens";
import { sampleTracks } from "../../../test/sampleTracks";
import { sampleUser } from "../../../test/sampleUsers";
import { App } from "../../../App";

jest.mock("axios");

describe("AllTracks", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing tracks", () => {
        test("When given sample tracks, should show list of 5 tracks", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
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
