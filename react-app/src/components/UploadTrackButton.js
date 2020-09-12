import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";

export default function UploadTrackButton() {
    const { t } = useTranslation();

    return (
        <div>
            <Button variant="contained" color="primary" startIcon={<PublishIcon />}>
                {t("button_upload_track")}
            </Button>
        </div>
    );
}
