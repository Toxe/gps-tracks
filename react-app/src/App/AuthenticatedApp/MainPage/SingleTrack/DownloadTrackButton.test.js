import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
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