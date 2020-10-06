import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens } from "../../test/sampleAuthTokens";
import { sampleTracks } from "../../test/sampleTracks";
import { sampleUser } from "../../test/sampleUsers";
import { AuthProvider } from "../../Auth/AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../Auth/API";
import App from "../../App/App";

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

describe("TracksFilter", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe('With "/tracks" page', () => {
        test("When changing no filter settings, show 5 tracks", async () => {
            const { findByRole } = setupPage();

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
        });

        test('When setting activity to "Bike", show 3 tracks', async () => {
            const { findByRole, findByLabelText, queryByRole } = setupPage();

            userEvent.click(await findByLabelText("Activity"));
            userEvent.click(await findByRole("option", { name: "Bike" }));

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
        });

        test('When setting year to "2017", show 2 tracks', async () => {
            const { findByRole, findByLabelText, queryByRole } = setupPage();

            userEvent.click(await findByLabelText("Year"));
            userEvent.click(await findByRole("option", { name: "2017" }));

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });

        test('When setting activity to "Hiking" and year to "2017", show 1 track', async () => {
            const { findByRole, findByLabelText, queryByRole } = setupPage();

            userEvent.click(await findByLabelText("Activity"));
            userEvent.click(await findByRole("option", { name: "Hiking" }));
            userEvent.click(await findByLabelText("Year"));
            userEvent.click(await findByRole("option", { name: "2017" }));

            await findByRole("heading", { name: "Track 28" });
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });
    });

    describe("With filter params in URL", () => {
        test('When URL params are "activity=all&year=all", show 5 tracks', async () => {
            const { findByRole } = setupPageWithUrlParams("activity=all&year=all");

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
        });

        test('When URL params are "activity=0", show 3 tracks', async () => {
            const { findByRole, queryByRole } = setupPageWithUrlParams("activity=0");

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
            expect(queryByRole("heading", { name: "Track 28" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
        });

        test('When URL params are "year=2017", show 2 tracks', async () => {
            const { findByRole, queryByRole } = setupPageWithUrlParams("year=2017");

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });

        test('When URL params are "activity=1&year=2017", show 1 track', async () => {
            const { findByRole, queryByRole } = setupPageWithUrlParams("activity=1&year=2017");

            await findByRole("heading", { name: "Track 28" });
            expect(queryByRole("heading", { name: "Track 21" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();
        });
    });
});
