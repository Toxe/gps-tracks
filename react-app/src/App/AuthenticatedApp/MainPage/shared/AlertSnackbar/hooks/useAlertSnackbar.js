import React, { useState, useCallback } from "react";
import Snackbar from "../Snackbar";

export default function useAlertSnackbar() {
    const [snackbar, setSnackbar] = useState(null);

    const hideSnackbar = useCallback(() => setSnackbar(null), []);

    const showSnackbar = useCallback((message, severity = "success", autoHideDuration = 3000) => {
        setSnackbar(
            <Snackbar
                message={message}
                severity={severity}
                autoHideDuration={autoHideDuration}
                handleRemove={() => setSnackbar(null)}
            />
        );
    }, []);

    return [snackbar, showSnackbar, hideSnackbar];
}
