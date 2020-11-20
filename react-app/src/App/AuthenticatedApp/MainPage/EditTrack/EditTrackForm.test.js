import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { sampleTrack, matchByTextContent, spyOnHook } from "../../../../test";
import * as useEditTrackForm from "./hooks/useEditTrackForm";
import EditTrackForm from "./EditTrackForm";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("EditTrackForm", () => {
    describe("Render form", () => {
        test("When track is valid, should show input form", async () => {
            const track = sampleTrack(21);

            const { findByText, findByRole } = render(
                <EditTrackForm track={track} handleSave={null} handleCancel={null} />
            );

            await findByText(matchByTextContent("Edit track “Track 21”"));
            await findByRole("button", { name: "Save Changes" });
            await findByRole("button", { name: "Cancel" });
        });

        test("When track is null, should return null", async () => {
            const { container } = render(<EditTrackForm track={null} handleSave={null} handleCancel={null} />);

            expect(container).toBeEmptyDOMElement();
        });

        test('When formValuesChanged is false, "Save Changes" button should be disabled', async () => {
            const track = sampleTrack(21);
            const formValues = { title: track.title, activity_mode: track.activity_mode };

            spyOnHook(useEditTrackForm).mockReturnValue({ formValues, formValuesChanged: false });

            const { findByRole } = render(<EditTrackForm track={track} handleSave={null} handleCancel={null} />);

            expect(await findByRole("button", { name: "Save Changes" })).toBeDisabled();
        });

        test('When formValuesChanged is true, "Save Changes" button should be enabled', async () => {
            const track = sampleTrack(21);
            const formValues = { title: track.title, activity_mode: track.activity_mode };

            spyOnHook(useEditTrackForm).mockReturnValue({ formValues, formValuesChanged: true });

            const { findByRole } = render(<EditTrackForm track={track} handleSave={null} handleCancel={null} />);

            expect(await findByRole("button", { name: "Save Changes" })).toBeEnabled();
        });
    });

    describe("Making changes", () => {
        test('When typing in a new track title, "Save Changes" button should become enabled', async () => {
            const track = sampleTrack(21);

            const { findByDisplayValue, findByRole } = render(
                <EditTrackForm track={track} handleSave={null} handleCancel={null} />
            );

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const titleTextbox = await findByDisplayValue("Track 21");

            // button disabled by default
            await waitFor(() => expect(saveChangesButton).toBeDisabled());

            userEvent.type(titleTextbox, "new title");
            await waitFor(() => expect(saveChangesButton).toBeEnabled());
        });

        test('When selecting a different activity mode, "Save Changes" button should become enabled', async () => {
            const track = sampleTrack(21);

            const { findByRole } = render(<EditTrackForm track={track} handleSave={null} handleCancel={null} />);

            const saveChangesButton = await findByRole("button", { name: "Save Changes" });
            const hikingRadioButton = await findByRole("radio", { name: "Hiking" });

            // button disabled by default
            await waitFor(() => expect(saveChangesButton).toBeDisabled());

            userEvent.click(hikingRadioButton);
            expect(saveChangesButton).toBeEnabled();
        });
    });

    describe("Saving and canceling changes", () => {
        test('When clicking "Save Changes", should call handleSave', async () => {
            const track = sampleTrack(21);
            const handleSave = jest.fn();
            const handleCancel = jest.fn();
            const formValues = { title: track.title, activity_mode: track.activity_mode };

            spyOnHook(useEditTrackForm).mockReturnValue({ formValues, formValuesChanged: true });

            const { findByRole } = render(<EditTrackForm track={track} handleSave={handleSave} handleCancel={handleCancel} />);

            userEvent.click(await findByRole("button", { name: "Save Changes" }));

            expect(handleSave).toHaveBeenCalled();
            expect(handleCancel).not.toHaveBeenCalled();
        });

        test('When clicking "Cancel", should call handleCancel', async () => {
            const track = sampleTrack(21);
            const handleSave = jest.fn();
            const handleCancel = jest.fn();

            const { findByRole } = render(<EditTrackForm track={track} handleSave={handleSave} handleCancel={handleCancel} />);

            userEvent.click(await findByRole("button", { name: "Cancel" }));

            expect(handleSave).not.toHaveBeenCalled();
            expect(handleCancel).toHaveBeenCalled();
        });
    });
});
