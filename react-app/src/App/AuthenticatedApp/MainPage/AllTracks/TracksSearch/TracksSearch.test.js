import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../../../../../test";
import { AuthProvider, saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../../../../Auth";
import { App } from "../../../../../App";

jest.mock("axios");

function setupPageWithUrlParams(urlParams) {
    const { access_token, refresh_token } = sampleAuthTokens(1);
    saveAuthTokensToLocalStorage(access_token, refresh_token);

    axiosMock.get.mockResolvedValueOnce({ data: sampleUser(1) }).mockResolvedValueOnce({ data: sampleTracks() });

    const url = urlParams ? `/tracks?${urlParams}` : "/tracks";
    window.history.pushState({}, "Test Page", url);

    return render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

function setupPage() {
    return setupPageWithUrlParams(undefined);
}

describe("TracksSearch", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe('With "/tracks" page', () => {
        test("When search field is empty, show 5 tracks", async () => {
            const { findByRole } = setupPage();

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
        });

        test('When searching for "Track 8", show 2 tracks', async () => {
            const { findByRole, queryByRole, findByPlaceholderText } = setupPage();

            userEvent.type(await findByPlaceholderText("Search…"), "Track 8");

            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
        });

        test('When searching for "nothing", show "No tracks found" message', async () => {
            const { findByText, queryByRole, findByPlaceholderText } = setupPage();

            userEvent.type(await findByPlaceholderText("Search…"), "nothing");

            await findByText("No tracks found.");
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });
    });

    describe("With search params in URL", () => {
        test('When URL params are "search=Track+8", show 2 tracks', async () => {
            const { findByRole, queryByRole } = setupPageWithUrlParams("search=Track+8");

            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
        });

        test('When URL params are "search=nothing", show 2 tracks', async () => {
            const { findByText, queryByRole } = setupPageWithUrlParams("search=nothing");

            await findByText("No tracks found.");
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });

        test('When click on "Clear search" button, clear search field and show all tracks', async () => {
            const { findByText, findByTitle, findByRole } = setupPageWithUrlParams("search=nothing");

            await findByText("No tracks found.");

            userEvent.click(await findByTitle("Clear search"));

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
        });
    });
});
