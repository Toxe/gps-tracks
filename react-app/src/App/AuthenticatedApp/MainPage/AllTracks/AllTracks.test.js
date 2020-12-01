import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { sampleTracks, spyOnHook } from "../../../../test";
import { MainPageProviders } from "../MainPageProviders";
import * as useAllTracks from "./hooks/useAllTracks";
import { AllTracks } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("AllTracks", () => {
    describe("With existing tracks", () => {
        test("When given sample tracks, should show list of 5 tracks", async () => {
            spyOnHook(useAllTracks).mockReturnValue({ tracks: sampleTracks() });

            const { findByRole } = render(
                <BrowserRouter>
                    <MainPageProviders>
                        <AllTracks />
                    </MainPageProviders>
                </BrowserRouter>
            );

            await findByRole("heading", { name: "Track 21" });
            await findByRole("heading", { name: "Track 28" });
            await findByRole("heading", { name: "Track 47" });
            await findByRole("heading", { name: "Track 85" });
            await findByRole("heading", { name: "Track 87" });
        });
    });

    describe("Without tracks", () => {
        test('When given no tracks, should show "No tracks found" message', async () => {
            spyOnHook(useAllTracks).mockReturnValue({ tracks: null });

            const { findByText } = render(
                <BrowserRouter>
                    <MainPageProviders>
                        <AllTracks />
                    </MainPageProviders>
                </BrowserRouter>
            );

            await findByText("No tracks found.");
        });
    });
});
