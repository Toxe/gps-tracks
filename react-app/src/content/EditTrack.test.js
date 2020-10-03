import React from "react";
import "../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

function matchByTextContent(queryText) {
    return (content, node) => node.textContent === queryText;
}

function setupEditTrackPage() {
    const { access_token, refresh_token } = sampleAuthTokens(1);
    saveAuthTokensToLocalStorage(access_token, refresh_token);

    axiosMock.get.mockResolvedValueOnce({ data: sampleUser(1) }).mockResolvedValueOnce({ data: sampleTracks() });

    window.history.pushState({}, "Test Page", "/tracks/21/edit");

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
            const { findByText } = setupEditTrackPage();

            await findByText("Track 21");
            await findByText(matchByTextContent("Edit track “Track 21”"));
            await findByText("Cancel");
            await findByText("Save Changes");
        });

        test('When selecting different activity mode, "Save Changes" button becomes enabled', async () => {
            const { findByRole } = setupEditTrackPage();

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const hikingRadioButton = await findByRole("radio", { name: "Hiking" });

            expect(saveChangesButton).toBeDisabled();

            userEvent.click(hikingRadioButton);
            expect(saveChangesButton).toBeEnabled();
        });

        test('When typing in a new track title, "Save Changes" button becomes enabled', async () => {
            const { findByRole, findByDisplayValue } = setupEditTrackPage();

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const titleTextbox = await findByDisplayValue("Track 21");

            expect(saveChangesButton).toBeDisabled();

            userEvent.type(titleTextbox, "new title");
            expect(saveChangesButton).toBeEnabled();
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
