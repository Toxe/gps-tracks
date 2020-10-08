import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DownloadTrackButton({ handleDownloadTrack }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} className={classes.button} onClick={handleDownloadTrack}>
                {t("button_download_track")}
            </Button>
        </div>
    );
}
