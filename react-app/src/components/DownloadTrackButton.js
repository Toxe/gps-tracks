import React from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { saveAs } from "file-saver";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DownloadTrackButton({ track, updateRequestError }) {
    const { t } = useTranslation();
    const classes = useStyles();

    if (!track) {
        return null;
    }

    const handleDownload = async () => {
        try {
            updateRequestError(null);
            const filename = track.links.download.split("/").pop();
            const response = await axios.get(track.links.download, { responseType: "blob" });
            saveAs(response.data, filename);
        } catch (error) {
            updateRequestError(error);
        }
    };

    return (
        <Button variant="contained" color="primary" startIcon={<SaveIcon />} className={classes.button} onClick={handleDownload}>
            {t("button_download_track")}
        </Button>
    );
}
