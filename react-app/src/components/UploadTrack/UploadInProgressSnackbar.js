import React from "react";
import { useTranslation } from "react-i18next";
import { Box, CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default function UploadInProgressSnackbar() {
    const { t } = useTranslation();

    return (
        <Snackbar open={true}>
            <Alert severity="info" elevation={6} icon={false}>
                <Box display="flex" alignItems="center">
                    <Box mr={4}>{t("upload_in_progress")}</Box>
                    <CircularProgress />
                </Box>
            </Alert>
        </Snackbar>
    );
}
