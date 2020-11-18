import React from "react";
import { useTranslation } from "react-i18next";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTrackDeletedSnackbar } from "./hooks";

export default function TrackDeletedSnackbar({ handleRemove }) {
    const { t } = useTranslation();
    const { open, handleClose } = useTrackDeletedSnackbar();

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} onExited={handleRemove}>
            <Alert onClose={handleClose} severity="success" elevation={6} variant="filled">
                {t("track_deleted")}
            </Alert>
        </Snackbar>
    );
}
