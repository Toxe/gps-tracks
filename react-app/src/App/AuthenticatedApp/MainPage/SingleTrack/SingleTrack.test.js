import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook, sampleTrack, sampleTrackSegments } from "../../../../test";
import { Tracks } from "../../api";
import * as useSingleTrack from "./hooks/useSingleTrack";
import { SingleTrack } from ".";

jest.mock("react-leaflet"); // don't actually render the Leaflet map
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

afterEach(() => {
    jest.restoreAllMocks();
});

describe("SingleTrack", () => {
    describe("With existing track", () => {
        test("When showing existing track, show track details", async () => {
            spyOnHook(useSingleTrack).mockReturnValue({ track: sampleTrack(21) });
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
            spyOnHook(useSingleTrack).mockReturnValue({ track: null });
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
