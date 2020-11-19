import React from "react";
import { Snackbar as MUISnackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useSnackbar } from "./hooks";

export default function Snackbar({ message, severity, autoHideDuration, handleRemove }) {
    const { open, handleClose } = useSnackbar();

    return (
        <MUISnackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} onExited={handleRemove}>
            <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled">
                {message}
            </Alert>
        </MUISnackbar>
    );
}
