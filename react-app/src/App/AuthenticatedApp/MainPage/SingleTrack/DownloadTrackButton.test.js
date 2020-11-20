import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DownloadTrackButton from "./DownloadTrackButton";

describe("DownloadTrackButton", () => {
    describe('With "Download" button rendered', () => {
        test('When clicking "Download" button, download track file', async () => {
            const handleDownloadTrack = jest.fn();
            const { findByRole } = render(<DownloadTrackButton handleDownloadTrack={handleDownloadTrack} />);

            userEvent.click(await findByRole("button", { name: "Download" }));

            expect(handleDownloadTrack).toHaveBeenCalled();
        });
    });
});
