import React, { useState } from "react";
import Snackbar from "../Snackbar";

export default function useAlertSnackbar() {
    const [snackbar, setSnackbar] = useState(null);

    const showSnackbar = (message, severity = "success", autoHideDuration = 3000) => {
        setSnackbar(
            <Snackbar
                message={message}
                severity={severity}
                autoHideDuration={autoHideDuration}
                handleRemove={() => setSnackbar(null)}
            />
        );
    };

    const hideSnackbar = () => {
        setSnackbar(null);
    };

    return [snackbar, showSnackbar, hideSnackbar];
}
