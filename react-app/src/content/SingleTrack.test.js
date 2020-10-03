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
import { sampleTrackSegments } from "../test/sampleTrackSegments";
import { sampleUser } from "../test/sampleUsers";
import App from "../app/App";

jest.mock("axios");
jest.mock("react-leaflet"); // don't actually render the Leaflet map

describe("SingleTrack", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing track", () => {
        test("When loading route /tracks/21, show details of track 21", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() })
                .mockResolvedValueOnce({ data: sampleTrackSegments() });

            window.history.pushState({}, "Test Page", "/tracks/21");

            const { findByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByText("Track 21");
            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });
    });

    describe("With non-existing track", () => {
        test('When loading route of non-existant track, show "Track not found" message', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get.mockResolvedValueOnce({ data: sampleUser(1) }).mockResolvedValueOnce({ data: [] });

            window.history.pushState({}, "Test Page", "/tracks/9999");

            const { findByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
