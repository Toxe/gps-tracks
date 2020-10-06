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

describe("TracksSort", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe('With "/tracks" page', () => {
        test("When sorting by default, sort by date descending", async () => {
            const { findAllByRole } = setupPage();

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 85");
            expect(tracks[1]).toHaveTextContent("Track 87");
            expect(tracks[2]).toHaveTextContent("Track 47");
            expect(tracks[3]).toHaveTextContent("Track 28");
            expect(tracks[4]).toHaveTextContent("Track 21");
        });

        test("When selecting sort by name, sort by name ascending", async () => {
            const { findAllByRole, findByLabelText, findByRole } = setupPage();

            userEvent.click(await findByLabelText("Sort by"));
            userEvent.click(await findByRole("option", { name: "Name" }));

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 21");
            expect(tracks[1]).toHaveTextContent("Track 28");
            expect(tracks[2]).toHaveTextContent("Track 47");
            expect(tracks[3]).toHaveTextContent("Track 85");
            expect(tracks[4]).toHaveTextContent("Track 87");
        });

        test("When selecting sort by distance, sort by distance descending", async () => {
            const { findAllByRole, findByLabelText, findByRole } = setupPage();

            userEvent.click(await findByLabelText("Sort by"));
            userEvent.click(await findByRole("option", { name: "Distance" }));

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 85");
            expect(tracks[1]).toHaveTextContent("Track 87");
            expect(tracks[2]).toHaveTextContent("Track 21");
            expect(tracks[3]).toHaveTextContent("Track 47");
            expect(tracks[4]).toHaveTextContent("Track 28");
        });

        test("When clicking on reverse order button, change sort order from descending to ascending", async () => {
            const { findAllByRole, findByTitle } = setupPage();

            userEvent.click(await findByTitle("Change sort order"));

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 21");
            expect(tracks[1]).toHaveTextContent("Track 28");
            expect(tracks[2]).toHaveTextContent("Track 47");
            expect(tracks[3]).toHaveTextContent("Track 87");
            expect(tracks[4]).toHaveTextContent("Track 85");
        });
    });

    describe("With sort params in URL", () => {
        test('When URL params are "order=asc", sort by (default) date ascending', async () => {
            const { findAllByRole } = setupPageWithUrlParams("order=asc");

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 21");
            expect(tracks[1]).toHaveTextContent("Track 28");
            expect(tracks[2]).toHaveTextContent("Track 47");
            expect(tracks[3]).toHaveTextContent("Track 87");
            expect(tracks[4]).toHaveTextContent("Track 85");
        });

        test('When URL params are "sort=name&order=desc", sort by name descending', async () => {
            const { findAllByRole } = setupPageWithUrlParams("sort=name&order=desc");

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 87");
            expect(tracks[1]).toHaveTextContent("Track 85");
            expect(tracks[2]).toHaveTextContent("Track 47");
            expect(tracks[3]).toHaveTextContent("Track 28");
            expect(tracks[4]).toHaveTextContent("Track 21");
        });

        test('When URL params are "sort=distance&order=asc", sort by distance ascending', async () => {
            const { findAllByRole } = setupPageWithUrlParams("sort=distance&order=asc");

            const tracks = await findAllByRole("heading", { name: /Track / });
            expect(tracks).toHaveLength(5);
            expect(tracks[0]).toHaveTextContent("Track 28");
            expect(tracks[1]).toHaveTextContent("Track 47");
            expect(tracks[2]).toHaveTextContent("Track 21");
            expect(tracks[3]).toHaveTextContent("Track 87");
            expect(tracks[4]).toHaveTextContent("Track 85");
        });
    });
});
