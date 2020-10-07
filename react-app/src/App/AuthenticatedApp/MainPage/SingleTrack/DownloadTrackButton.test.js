import React from "react";
import "../../../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { saveAs as saveAsMock } from "file-saver";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../../../Auth";
import { sampleAuthTokens } from "../../../../test/sampleAuthTokens";
import { sampleTracks } from "../../../../test/sampleTracks";
import { sampleUser } from "../../../../test/sampleUsers";
import { sampleTrackSegments } from "../../../../test/sampleTrackSegments";
import { App } from "../../../../App";

jest.mock("axios");
jest.mock("file-saver");
jest.mock("react-leaflet"); // don't actually render the Leaflet map

describe("DownloadTrackButton", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With track details page opened", () => {
        test('When clicking "Download" button, download track file', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() })
                .mockResolvedValueOnce({ data: sampleTrackSegments() })
                .mockResolvedValueOnce({ data: new Blob(["content"], { type: "application/gpx+xml" }) });

            saveAsMock.mockReturnValueOnce("test");

            window.history.pushState({}, "Test Page", "/tracks/21");

            const { findByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            userEvent.click(await findByRole("button", { name: "Download" }));

            await waitFor(() => expect(saveAsMock).toHaveBeenCalled());
        });
    });
});
