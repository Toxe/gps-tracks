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

export default function DownloadTrackButton({ track }) {
    const { t } = useTranslation();
    const classes = useStyles();

    if (!track)
        return null;

    return (
        <Button variant="contained" color="primary" startIcon={<SaveIcon />} className={classes.button}>
            {t("button_download_track")}
        </Button>
    );
}
