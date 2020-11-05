import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { spyOnHook } from "../../../../../test";
import * as useUploadResultsSnackbar from "./hooks/useUploadResultsSnackbar";
import UploadResultsSnackbar from "./UploadResultsSnackbar";

describe("UploadResultsSnackbar", () => {
    describe("With at least one successful upload", () => {
        it("Works for 1/1 successful uploads", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={1} numFilesUploadedSuccessfully={1} />);
            getByText("File successfully imported.");
        });

        it("Works for 3/3 successful uploads", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={3} />);
            getByText("All files successfully imported.");
        });

        it("Works for 1/3 successful uploads", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={1} />);
            getByText("1 out of 3 files successfully imported.");
        });
    });

    describe("All uploads failed", () => {
        it("Works for 0/1 successful uploads", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={1} numFilesUploadedSuccessfully={0} />);
            getByText("File could not be imported.");
        });

        it("Works for 0/3 successful uploads", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={0} />);
            getByText("No files could be imported.");
        });

        it("Works with no upload files", () => {
            const { getByText } = render(<UploadResultsSnackbar numFiles={0} numFilesUploadedSuccessfully={0} />);
            getByText("No files could be imported.");
        });
    });

    describe("With UploadResultsSnackbar visible", () => {
        test('When "Close" button clicked, should call handleClose', () => {
            const handleClose = jest.fn();

            spyOnHook(useUploadResultsSnackbar).mockReturnValue({ open: true, handleClose });

            const { getByRole } = render(<UploadResultsSnackbar numFiles={1} numFilesUploadedSuccessfully={1} />);

            userEvent.click(getByRole("button", { name: "Close" }));
            expect(handleClose).toHaveBeenCalled();
        });
    });
});
