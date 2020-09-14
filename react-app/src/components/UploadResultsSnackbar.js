import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

function getMessage(numFiles, numFilesUploadedSuccessfully) {
    if (numFilesUploadedSuccessfully === 0) {
        // no file imported
        if (numFiles === 1) {
            return ["error", "File could not be imported."];
        } else {
            return ["error", "No files could be imported."];
        }
    } else {
        // at least one file imported
        if (numFiles === 1 && numFilesUploadedSuccessfully === numFiles) {
            return ["success", "File successfully imported."];
        } else if (numFiles > 1 && numFilesUploadedSuccessfully === numFiles) {
            return ["success", "All files successfully imported."];
        } else {
            return ["warning", `${numFilesUploadedSuccessfully} out of ${numFiles} files successfully imported.`];
        }
    }
}

export default function UploadResultsSnackbar({ numFiles, numFilesUploadedSuccessfully, handleRemove }) {
    const [open, setOpen] = useState(true);
    const [severity, message] = getMessage(numFiles, numFilesUploadedSuccessfully);
    const autoHideDuration = severity === "success" ? 5000 : null;

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} onExited={handleRemove}>
                <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
