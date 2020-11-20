import React from "react";
import "../../../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteTrackButton from "./DeleteTrackButton";

describe("DeleteTrackButton", () => {
    describe('With "Delete" button rendered', () => {
        test('When clicking "Yes, delete!", call handleDeleteTrack and close dialog', async () => {
            const handleDeleteTrack = jest.fn();
            const { findByRole, queryByRole } = render(<DeleteTrackButton handleDeleteTrack={handleDeleteTrack} />);

            // open delete dialog
            userEvent.click(await findByRole("button", { name: "Delete" }));

            await findByRole("heading", { name: "Do you really want to delete this track?" });
            const submitButton = await findByRole("button", { name: "Yes, delete!" });

            // click "Yes, delete!" button
            userEvent.click(submitButton);

            // close dialog, delete track
            expect(handleDeleteTrack).toHaveBeenCalled();

            await waitFor(() =>
                expect(
                    queryByRole("heading", { name: "Do you really want to delete this track?" })
                ).not.toBeInTheDocument()
            );
        });

        test('When clicking "Cancel", close dialog', async () => {
            const handleDeleteTrack = jest.fn();
            const { findByRole, queryByRole } = render(<DeleteTrackButton handleDeleteTrack={handleDeleteTrack} />);

            // open delete dialog
            userEvent.click(await findByRole("button", { name: "Delete" }));

            await findByRole("heading", { name: "Do you really want to delete this track?" });
            const cancelButton = await findByRole("button", { name: "Cancel" });

            // click "Cancel" button
            userEvent.click(cancelButton);

            // close dialog, don't delete track
            expect(handleDeleteTrack).not.toHaveBeenCalled();

            await waitFor(() =>
                expect(
                    queryByRole("heading", { name: "Do you really want to delete this track?" })
                ).not.toBeInTheDocument()
            );
        });
    });
});
