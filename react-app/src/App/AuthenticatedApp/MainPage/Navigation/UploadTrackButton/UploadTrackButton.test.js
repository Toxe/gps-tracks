import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTracks } from "../../../TracksProvider";
import { UploadTrackButton } from ".";

jest.mock("../../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("UploadTrackButton", () => {
    describe("With visible UploadTrackButton", () => {
        test('When "Upload" button clicked, show upload dialog', async () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { findByText, findByRole } = render(<UploadTrackButton />);

            userEvent.click(await findByRole("button", { name: "Upload" }));

            await findByRole("heading", { name: "Upload file" });
            await findByText("Drag and drop one or more .gpx files here or click");
        });
    });
});
