import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Track from "../components/Track/Track";
import { useTracks } from "../api/TracksProvider";
import { Map, Polyline, TileLayer } from "react-leaflet";
import { latLngBounds } from "leaflet";

const useStyles = makeStyles(() => ({
    map: {
        height: 600,
        width: "100%",
    },
}));

export default function SingleTrack() {
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
