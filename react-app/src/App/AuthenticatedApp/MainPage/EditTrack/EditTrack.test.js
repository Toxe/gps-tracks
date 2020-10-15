import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { sampleTrack, matchByTextContent, spyOnHook } from "../../../../test";
import * as useEditTrack from "./hooks/useEditTrack";
import { EditTrack } from ".";

jest.mock("react-leaflet"); // don't actually render the Leaflet map

function setupEditTrackPage() {
    return render(
        <BrowserRouter>
            <EditTrack />
        </BrowserRouter>
    );
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("EditTrack", () => {
    describe("With existing track", () => {
        test("When showing edit page for track 21, track info and a form should be visible", async () => {
            const track = sampleTrack(21);
            const formValues = { title: track.title, activity_mode: track.activity_mode };

            spyOnHook(useEditTrack).mockReturnValue({ track, formValues, formValuesChanged: false });

            const { findByText, findByRole } = setupEditTrackPage();

            await findByText(matchByTextContent("Edit track “Track 21”"));
            await findByRole("heading", { name: "Track 21" });
            await findByRole("button", { name: "Save Changes" });
            await findByRole("button", { name: "Cancel" });
        });
    });

    describe("With non-existing track", () => {
        test('When showing edit page for non-existant track, show "Track not found" message', async () => {
            const track = null;
            spyOnHook(useEditTrack).mockReturnValue({ track });

            const { findByText } = setupEditTrackPage();

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
