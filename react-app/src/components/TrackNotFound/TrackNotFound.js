import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertTitle } from "@material-ui/lab";

export default function TrackNotFound() {
    const { t } = useTranslation();

    return (
        <Alert severity="warning">
            <AlertTitle>{t("details_not_found_title")}</AlertTitle>
            {t("details_not_found_text")}
        </Alert>
    );
}
