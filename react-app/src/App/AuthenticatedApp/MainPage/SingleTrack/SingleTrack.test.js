import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { sampleTrack, sampleTrackSegments } from "../../../../test";
import { Tracks } from "../../api";
import * as tracksProviderExports from "../../TracksProvider/TracksProvider";
import * as userProviderExports from "../../UserProvider/UserProvider";
import * as lastVisitedAllTracksPageProviderExports from "../MainPageProviders/LastVisitedAllTracksPageProvider/LastVisitedAllTracksPageProvider";
import { SingleTrack } from ".";

jest.mock("react-leaflet"); // don't actually render the Leaflet map
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

function setupBasicMocks(getTrack, deleteTrack) {
    const returnToLastVisitedAllTracksPage = jest.fn();

    jest.spyOn(tracksProviderExports, "useTracks").mockReturnValue({ getTrack, deleteTrack });
    jest.spyOn(userProviderExports, "useUser").mockReturnValue({ user: 1 });
    jest.spyOn(lastVisitedAllTracksPageProviderExports, "useLastVisitedAllTracksPage").mockReturnValue({ returnToLastVisitedAllTracksPage });
}

afterEach(() => {
    jest.restoreAllMocks();
});

describe("SingleTrack", () => {
    describe("With existing track", () => {
        test("When showing existing track, show track details", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            setupBasicMocks(getTrack, null);

            jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

            const { findByText, findByRole } = render(
                <BrowserRouter>
                    <SingleTrack />
                </BrowserRouter>
            );

            await findByRole("heading", { name: "Track 21" });
            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });
    });

    describe("With non-existing track", () => {
        test('When showing non-existing track, show "Track not found" message', async () => {
            const getTrack = jest.fn(() => null);
            setupBasicMocks(getTrack, null);

            jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

            const { findByText } = render(
                <BrowserRouter>
                    <SingleTrack />
                </BrowserRouter>
            );

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
