import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { AuthProvider } from "../../auth/AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../auth/API";
import { sampleAuthTokens } from "../../test/sampleAuthTokens";
import { sampleTracks } from "../../test/sampleTracks";
import { sampleUser } from "../../test/sampleUsers";
import { sampleTrackSegments } from "../../test/sampleTrackSegments";
import App from "../../app/App";

jest.mock("axios");
jest.mock("react-leaflet"); // don't actually render the Leaflet map

describe("DeleteTrackButton", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With track details page opened", () => {
        test('When clicking "Yes, delete!" button, delete track and navigate to /tracks', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() })
                .mockResolvedValueOnce({ data: sampleTrackSegments() });

            axiosMock.delete.mockResolvedValueOnce({ status: 204 });

            window.history.pushState({}, "Test Page", "/tracks/21");

            const { findByText, findAllByText, findByRole, getByText, queryByText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            await findByText("Track 21");
            const deleteButton = await findByRole("button", { name: "Delete" });

            // open delete dialog
            userEvent.click(deleteButton);

            await findByText("Do you really want to delete this track?");
            const submitButton = await findByRole("button", { name: "Yes, delete!" });

            // click "Yes, delete!" button
            userEvent.click(submitButton);

            // automatically navigate back to /tracks
            await findAllByText("4 Tracks");

            expect(getByText("Track 28")).toBeInTheDocument();
            expect(getByText("Track 47")).toBeInTheDocument();
            expect(getByText("Track 85")).toBeInTheDocument();
            expect(getByText("Track 87")).toBeInTheDocument();
            expect(queryByText("Track 21")).not.toBeInTheDocument();
        });
    });
});
