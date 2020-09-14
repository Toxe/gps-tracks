import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UploadResultsSnackbar from "../UploadResultsSnackbar";

it("works for 1/1 successful uploads", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={1} numFilesUploadedSuccessfully={1} />);
    getByText("File successfully imported.");
});

it("works for 3/3 successful uploads", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={3} />);
    getByText("All files successfully imported.");
});

it("works for 1/3 successful uploads", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={1} />);
    getByText("1 out of 3 files successfully imported.");
});

it("works for 0/3 successful uploads", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={3} numFilesUploadedSuccessfully={0} />);
    getByText("No files could be imported.");
});

it("works for 0/1 successful uploads", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={1} numFilesUploadedSuccessfully={0} />);
    getByText("File could not be imported.");
});

it("works with no upload files", () => {
    const { getByText } = render(<UploadResultsSnackbar numFiles={0} numFilesUploadedSuccessfully={0} />);
    getByText("No files could be imported.");
});
