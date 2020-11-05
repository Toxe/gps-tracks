import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useUploadResultsSnackbar } from "./hooks";

export default function UploadResultsSnackbar({ numFiles, numFilesUploadedSuccessfully, handleRemove }) {
    const { open, message, messageSeverity, handleClose } = useUploadResultsSnackbar(numFiles, numFilesUploadedSuccessfully);
    const autoHideDuration = messageSeverity === "success" ? 5000 : null;

    return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} onExited={handleRemove}>
            <Alert onClose={handleClose} severity={messageSeverity} elevation={6} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
}
