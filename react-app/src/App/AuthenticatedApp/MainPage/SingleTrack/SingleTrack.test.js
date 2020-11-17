import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook, sampleTrack } from "../../../../test";
import * as useSingleTrack from "./hooks/useSingleTrack";
import * as useTrackMap from "./hooks/useTrackMap";
import { SingleTrack } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("SingleTrack", () => {
    describe("With existing track", () => {
        test("When showing existing track, show track details", async () => {
            spyOnHook(useTrackMap).mockReturnValue({ segments: null, bounds: null }); // don't actually render the Leaflet map
            spyOnHook(useSingleTrack).mockReturnValue({ track: sampleTrack(21) });

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
