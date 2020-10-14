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

function setupSingleTrackComponent(getTrack) {
    const deleteTrack = jest.fn();
    const returnToLastVisitedAllTracksPage = jest.fn();

    jest.spyOn(tracksProviderExports, "useTracks").mockReturnValue({ getTrack, deleteTrack });
    jest.spyOn(userProviderExports, "useUser").mockReturnValue({ user: 1 });
    jest.spyOn(lastVisitedAllTracksPageProviderExports, "useLastVisitedAllTracksPage").mockReturnValue({ returnToLastVisitedAllTracksPage });
    jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

    return render(
        <BrowserRouter>
            <SingleTrack />
        </BrowserRouter>
    );
}

describe("SingleTrack", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("With existing track", () => {
        test("When showing existing track, show track details", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            const { findByText, findByRole } = setupSingleTrackComponent(getTrack);

            await findByRole("heading", { name: "Track 21" });
            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });
    });

    describe("With non-existing track", () => {
        test('When showing non-existing track, show "Track not found" message', async () => {
            const getTrack = jest.fn(() => null);
            const { findByText } = setupSingleTrackComponent(getTrack);

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
