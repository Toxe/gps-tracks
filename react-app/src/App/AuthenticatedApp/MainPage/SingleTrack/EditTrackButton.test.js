import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditTrackButton from "./EditTrackButton";

describe("EditTrackButton", () => {
    describe('With "Edit" button rendered', () => {
        test('When clicking "Edit" button, call handleEditTrack', async () => {
            const handleEditTrack = jest.fn();
            const { findByRole } = render(<EditTrackButton handleEditTrack={handleEditTrack} />);

            userEvent.click(await findByRole("button", { name: "Edit" }));

            expect(handleEditTrack).toHaveBeenCalled();
        });
    });
});
