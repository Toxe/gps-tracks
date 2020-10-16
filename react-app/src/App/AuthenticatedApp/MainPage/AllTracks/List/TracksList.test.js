import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { sampleTracks } from "../../../../../test";
import TracksList from "./TracksList";

describe("TracksList", () => {
    describe("Show TracksList", () => {
        test("With tracks containing 5 sample tracks, should show list of 5 tracks", () => {
            const { getByRole } = render(
                <BrowserRouter>
                    <TracksList tracks={sampleTracks()} />
                </BrowserRouter>
            );

            getByRole("heading", { name: "Track 21" });
            getByRole("heading", { name: "Track 28" });
            getByRole("heading", { name: "Track 47" });
            getByRole("heading", { name: "Track 85" });
            getByRole("heading", { name: "Track 87" });
        });
    });

    describe("Hide TracksList", () => {
        test("When tracks is null, should not show list and return null", () => {
            const { container } = render(<TracksList tracks={null} />);
            expect(container).toBeEmptyDOMElement();
        });

        test("When tracks is undefined, should not show list and return null", () => {
            const { container } = render(<TracksList tracks={undefined} />);
            expect(container).toBeEmptyDOMElement();
        });

        test("When tracks is an empty array, should not show list and return null", () => {
            const { container } = render(<TracksList tracks={[]} />);
            expect(container).toBeEmptyDOMElement();
        });
    });
});
