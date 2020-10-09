import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import axiosMock from "axios";
import { sampleTrack, sampleTrackSegments } from "../../../../test";
import * as tracksProviderExports from "../../TracksProvider/TracksProvider";
import * as userProviderExports from "../../UserProvider/UserProvider";
import * as lastVisitedAllTracksPageProviderExports from "../MainPageProviders/LastVisitedAllTracksPageProvider/LastVisitedAllTracksPageProvider";
import { SingleTrack } from ".";

jest.mock("axios");
jest.mock("react-leaflet"); // don't actually render the Leaflet map
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

function setup(getTrack) {
    axiosMock.get.mockResolvedValueOnce({ data: sampleTrackSegments() });

    const deleteTrack = jest.fn();
    const returnToLastVisitedAllTracksPage = jest.fn();

    const useTracksSpy = jest.spyOn(tracksProviderExports, "useTracks");
    useTracksSpy.mockReturnValue({ getTrack, deleteTrack });

    const useUserSpy = jest.spyOn(userProviderExports, "useUser");
    useUserSpy.mockReturnValue({ user: 1 });

    const useLastVisitedAllTracksPageSpy = jest.spyOn(lastVisitedAllTracksPageProviderExports, "useLastVisitedAllTracksPage");
    useLastVisitedAllTracksPageSpy.mockReturnValue({ returnToLastVisitedAllTracksPage });

    return render(
        <BrowserRouter>
            <SingleTrack />
        </BrowserRouter>
    );
}

describe("SingleTrack", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("With existing track", () => {
        test("When loading data for existing track, show track details", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            const { findByText, findByRole } = setup(getTrack);

            await findByRole("heading", { name: "Track 21" });
            await findByText("Edit");
            await findByText("Download");
            await findByText("Delete");
        });
    });

    describe("With non-existing track", () => {
        test('When loading data for non-existing track, show "Track not found" message', async () => {
            const getTrack = jest.fn(() => null);
            const { findByText } = setup(getTrack);

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
