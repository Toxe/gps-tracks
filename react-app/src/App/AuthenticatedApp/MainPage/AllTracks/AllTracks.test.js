import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../../../../test";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../../../Auth";
import { App } from "../../../../App";

jest.mock("axios");

describe("AllTracks", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing tracks", () => {
        test("When given sample tracks, should show list of 5 tracks", async () => {
            saveAuthTokensToLocalStorage(sampleAuthTokens(1));

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
            saveAuthTokensToLocalStorage(sampleAuthTokens(1));

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
