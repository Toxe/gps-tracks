import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import {
    sampleAuthTokens,
    sampleTrack,
    sampleTracks,
    sampleUser,
    sampleTrackSegments,
    matchByTextContent,
} from "../../../../test";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../../../Auth";
import { Tracks, Users } from "../../api";
import { ActivityMode } from "../utils/enums";
import { App } from "../../../../App";

jest.mock("react-leaflet"); // don't actually render the Leaflet map

function setupEditTrackPage(trackId) {
    const { access_token, refresh_token } = sampleAuthTokens(1);
    saveAuthTokensToLocalStorage(access_token, refresh_token);

    window.history.pushState({}, "Test Page", `/tracks/${trackId}/edit`);

    return render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

describe("EditTrack", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With existing track", () => {
        test("When loading route /tracks/21/edit, show edit page for track 21", async () => {
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());

            const { findByText, findByRole } = setupEditTrackPage(21);

            await findByRole("heading", { name: "Track 21" });
            await findByText(matchByTextContent("Edit track “Track 21”"));
            await findByText("Cancel");
            await findByText("Save Changes");
        });

        test('When selecting different activity mode, "Save Changes" button becomes enabled', async () => {
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());

            const { findByRole } = setupEditTrackPage(21);

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const hikingRadioButton = await findByRole("radio", { name: "Hiking" });

            expect(saveChangesButton).toBeDisabled();

            userEvent.click(hikingRadioButton);
            expect(saveChangesButton).toBeEnabled();
        });

        test('When typing in a new track title, "Save Changes" button becomes enabled', async () => {
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());

            const { findByRole, findByDisplayValue } = setupEditTrackPage(21);

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const titleTextbox = await findByDisplayValue("Track 21");

            expect(saveChangesButton).toBeDisabled();

            userEvent.type(titleTextbox, "new title");
            expect(saveChangesButton).toBeEnabled();
        });
    });

    describe("With editing a track", () => {
        test('When clicking "Save Changes", update track data and reload track details page with new values', async () => {
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());
            jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());
            jest.spyOn(Tracks, "update").mockReturnValueOnce({
                ...sampleTrack(21),
                title: "Track 21changed",
                activity_mode: ActivityMode.HIKING,
            });

            const { findByText, findByRole, findByDisplayValue } = setupEditTrackPage(21);

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
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());
            jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

            const { findByText, findByRole, findByDisplayValue } = setupEditTrackPage(21);

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
            jest.spyOn(Users, "get").mockReturnValueOnce(sampleUser(1));
            jest.spyOn(Users, "tracks").mockReturnValueOnce([]);

            const { findByText } = setupEditTrackPage(9999);

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
