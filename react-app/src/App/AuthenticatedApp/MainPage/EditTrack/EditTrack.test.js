import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { sampleTrack, matchByTextContent, spyOnHook } from "../../../../test";
import * as useEditTrack from "./hooks/useEditTrack";
import { EditTrack } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("EditTrack", () => {
    describe("With existing track", () => {
        test("When showing edit page for track 21, should show track info and edit form", async () => {
            const track = sampleTrack(21);
            const formValues = { title: track.title, activity_mode: track.activity_mode };

            spyOnHook(useEditTrack).mockReturnValue({ track, formValues, formValuesChanged: false });

            const { findByText, findByRole } = render(
                <BrowserRouter>
                    <EditTrack navigateToSingleTrack={jest.fn()} />
                </BrowserRouter>
            );

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

            const { findByText } = render(
                <BrowserRouter>
                    <EditTrack navigateToSingleTrack={jest.fn()} />
                </BrowserRouter>
            );

            await findByText("Track not found");
            await findByText("The track you are looking for does not exist.");
        });
    });
});
