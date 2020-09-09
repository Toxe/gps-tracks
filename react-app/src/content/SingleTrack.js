import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import Track from "../components/Track/Track";
import TrackMap from "../components/TrackMap/TrackMap";
import { useTracks } from "../api/TracksProvider";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function SingleTrack() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { trackId } = useParams();
    const { getTrack } = useTracks();
    const [track, setTrack] = useState(null);

    useEffect(() => {
        setTrack(getTrack(trackId));
    }, [trackId, getTrack]);

    return (
        <div>
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} className={classes.button}>
                    {t("button_download_track")}
                </Button>
                <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} className={classes.button}>
                    {t("button_delete_track")}
                </Button>
            </Box>
            <TrackMap track={track} />
        </div>
    );
}
