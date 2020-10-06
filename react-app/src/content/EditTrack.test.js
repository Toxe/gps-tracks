import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens } from "../test/sampleAuthTokens";
import { matchByTextContent } from "../test/matchByTextContent";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../Auth";
import { sampleTrack, sampleTracks } from "../test/sampleTracks";
import { sampleUser } from "../test/sampleUsers";
import { sampleTrackSegments } from "../test/sampleTrackSegments";
import { ActivityMode } from "../utils/enums";
import { App } from "../App";

jest.mock("axios");
jest.mock("react-leaflet"); // don't actually render the Leaflet map

function setupEditTrackPage() {
    const { access_token, refresh_token } = sampleAuthTokens(1);
    saveAuthTokensToLocalStorage(access_token, refresh_token);

    window.history.pushState({}, "Test Page", "/tracks/21/edit");

    return render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

describe("EditTrack", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing track", () => {
        test("When loading route /tracks/21/edit, show edit page for track 21", async () => {
            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByText, findByRole } = setupEditTrackPage();

            await findByRole("heading", { name: "Track 21" });
            await findByText(matchByTextContent("Edit track “Track 21”"));
            await findByText("Cancel");
            await findByText("Save Changes");
        });

        test('When selecting different activity mode, "Save Changes" button becomes enabled', async () => {
            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByRole } = setupEditTrackPage();

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const hikingRadioButton = await findByRole("radio", { name: "Hiking" });

            expect(saveChangesButton).toBeDisabled();

            userEvent.click(hikingRadioButton);
            expect(saveChangesButton).toBeEnabled();
        });

        test('When typing in a new track title, "Save Changes" button becomes enabled', async () => {
            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByRole, findByDisplayValue } = setupEditTrackPage();

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const titleTextbox = await findByDisplayValue("Track 21");

            expect(saveChangesButton).toBeDisabled();

            userEvent.type(titleTextbox, "new title");
            expect(saveChangesButton).toBeEnabled();
        });
    });

    describe("With editing a track", () => {
        test('When clicking "Save Changes", update track data and reload track details page with new values', async () => {
            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() })
                .mockResolvedValueOnce({ data: sampleTrackSegments() });

            axiosMock.put.mockResolvedValueOnce({
                data: { ...sampleTrack(21), title: "Track 21changed", activity_mode: ActivityMode.HIKING },
            });

            const { findByText, findByRole, findByDisplayValue } = setupEditTrackPage();

            // change values
            userEvent.click(await findByRole("radio", { name: "Hiking" }));
            userEvent.type(await findByDisplayValue("Track 21"), "changed");

            // click "Save Changes"
            userEvent.click(await findByRole("button", { name: "Save Changes" }));

            // go back to track details page
            await findByRole("heading", { name: "Track 21changed" });
            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });

        test('When clicking "Cancel", discard changes and reload track details page with old values', async () => {
            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() })
                .mockResolvedValueOnce({ data: sampleTrackSegments() });

            const { findByText, findByRole, findByDisplayValue } = setupEditTrackPage();

            // change values
            userEvent.click(await findByRole("radio", { name: "Hiking" }));
            userEvent.type(await findByDisplayValue("Track 21"), "changed");

            // click "Cancel"
            userEvent.click(await findByRole("button", { name: "Cancel" }));

            // go back to track details page
            await findByRole("heading", { name: "Track 21" });
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

            window.history.pushState({}, "Test Page", "/tracks/9999/edit");

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
