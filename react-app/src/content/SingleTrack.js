import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import Track from "../components/Track/Track";
import { useTracks } from "../api/TracksProvider";
import { Map, Polyline, TileLayer } from "react-leaflet";
import { latLngBounds } from "leaflet";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    map: {
        height: 600,
        width: "100%",
    },
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
    const [segments, setSegments] = useState(null);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        async function loadSegments(track) {
            const response = await axios.get(track.links.segments);
            setSegments(response.data);
            setBounds(latLngBounds(response.data));
        }

        if (track) {
            loadSegments(track);
        }
    }, [track]);

    useEffect(() => {
        setTrack(getTrack(trackId));
    }, [trackId, getTrack]);

    if (!bounds) {
        return null;
    }

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
            <Map bounds={bounds} className={classes.map}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline color="blue" positions={segments} weight={4} />
            </Map>
        </div>
    );
}
