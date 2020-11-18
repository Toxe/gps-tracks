import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { spyOnHook } from "../../../test";
import * as useChangesSavedSnackbar from "./hooks/useChangesSavedSnackbar";
import ChangesSavedSnackbar from "./ChangesSavedSnackbar";

describe("ChangesSavedSnackbar", () => {
    describe("With visible component", () => {
        test('When component is visible, should show "Changes saved" text', async () => {
            const { getByText } = render(<ChangesSavedSnackbar />);

            expect(getByText(/changes saved/i)).toBeInTheDocument();
        });

        test('When "Close" button clicked, should call handleClose', () => {
            const handleClose = jest.fn();
            spyOnHook(useChangesSavedSnackbar).mockReturnValue({ open: true, handleClose });

            const { getByRole } = render(<ChangesSavedSnackbar />);

            userEvent.click(getByRole("button", { name: "Close" }));
            expect(handleClose).toHaveBeenCalled();
        });
    });
});
