import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { sampleTracks } from "../../../../../test";
import { List } from ".";

describe("List", () => {
    describe("With tracks", () => {
        test("When tracks contains 5 sample tracks and tracksPerPage is 2, should show list of 2 tracks and pager with 3 pages", () => {
            const { getByRole, queryByRole } = render(
                <BrowserRouter>
                    <List tracks={sampleTracks()} tracksPerPage={2} />
                </BrowserRouter>
            );

            expect(getByRole("heading", { name: "Track 21" })).toBeInTheDocument();
            expect(getByRole("heading", { name: "Track 28" })).toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 47" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 85" })).not.toBeInTheDocument();
            expect(queryByRole("heading", { name: "Track 87" })).not.toBeInTheDocument();

            getByRole("button", { name: "page 1" });
            getByRole("button", { name: "Go to page 2" });
            getByRole("button", { name: "Go to page 3" });
        });
    });

    describe("Without tracks", () => {
        test('When tracks is null, should show "no tracks found" message', () => {
            const { getByText } = render(<List tracks={null} tracksPerPage={25} />);
            getByText("No tracks found.");
        });

        test('When tracks is an empty array, should show "no tracks found" message', () => {
            const { getByText } = render(<List tracks={[]} tracksPerPage={25} />);
            getByText("No tracks found.");
        });
    });
});
