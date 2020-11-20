import React from "react";
import { render } from "@testing-library/react";
import UploadInProgressSnackbar from "./UploadInProgressSnackbar";

describe("UploadInProgressSnackbar", () => {
    describe("With visible component", () => {
        test('When component is visible, should show "Upload in progress" text', async () => {
            const { getByText } = render(<UploadInProgressSnackbar />);

            expect(getByText(/upload in progress/i)).toBeInTheDocument();
        });
    });
});
