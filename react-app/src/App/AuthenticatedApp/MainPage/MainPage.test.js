import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { sampleTrack, sampleTracks, sampleTrackSegments } from "../../../test";
import { AuthProvider } from "../../../Auth";
import { Tracks } from "../api";
import { useTracks } from "../TracksProvider";
import { useUser } from "../UserProvider";
import { MainPage } from ".";

jest.mock("react-leaflet"); // don't actually render the Leaflet map

jest.mock("../TracksProvider");
jest.mock("../UserProvider");

function renderWithRoute(route) {
    const tracks = sampleTracks();
    const getTrack = jest.fn(() => sampleTrack(21));

    useUser.mockReturnValue({ user: 1 });
    useTracks.mockReturnValue({ tracks, getTrack });

    window.history.pushState({}, "Test Page", route);

    return render(
        <AuthProvider>
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        </AuthProvider>
    );
}

describe("MainPage", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("With SingleTrack content", () => {
        test("When loading route /tracks/21, show content for track 21", async () => {
            jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

            const { findByText } = renderWithRoute("/tracks/21");

            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });
    });

    describe("With AllTracks content", () => {
        test("When loading route /tracks, show content for all tracks", async () => {
            const { findByText } = renderWithRoute("/tracks");

            await findByText("Sort by");
        });
    });

    describe("With EditTrack content", () => {
        test("When loading route /tracks/21/edit, show content for editing track 21", async () => {
            const { findByText } = renderWithRoute("/tracks/21/edit");

            await findByText("Save Changes");
        });
    });

    describe("With undefined route", () => {
        test("When loading an undefined route, redirect and show all tracks", async () => {
            const { findByText } = renderWithRoute("/this/should/not-exist");

            await findByText("Sort by");
        });
    });
});
