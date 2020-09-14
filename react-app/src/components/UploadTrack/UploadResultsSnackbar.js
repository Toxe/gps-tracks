import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

export default function UploadResultsSnackbar({ numFiles, numFilesUploadedSuccessfully, handleRemove }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const getMessage = (numFiles, numFilesUploadedSuccessfully) => {
        if (numFilesUploadedSuccessfully === 0) {
            // no file imported
            return ["error", t("upload_error", { count: numFiles })];
        } else {
            // at least one file imported
            if (numFilesUploadedSuccessfully === numFiles && numFiles >= 1) {
                return ["success", t("upload_success", { count: numFiles })];
            } else {
                return ["warning", t("upload_success_partial", { numFilesUploadedSuccessfully, numFiles })];
            }
        }
    };

    const [severity, message] = getMessage(numFiles, numFilesUploadedSuccessfully);
    const autoHideDuration = severity === "success" ? 5000 : null;

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
