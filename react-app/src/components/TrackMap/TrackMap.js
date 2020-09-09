import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Map, Polyline, TileLayer } from "react-leaflet";
import { latLngBounds } from "leaflet";

const useStyles = makeStyles((theme) => ({
    map: {
        height: 600,
        width: "100%",
    },
}));

export default function TrackMap({ track }) {
    const classes = useStyles();
    const [segments, setSegments] = useState(null);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        async function loadSegments(track) {
            const response = await axios.get(track.links.segments);
            setSegments(response.data);
            setBounds(latLngBounds(response.data));
        }

        if (track)
            loadSegments(track);
    }, [track]);

    if (!bounds)
        return null;

    return (
        <Map bounds={bounds} className={classes.map}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline color="blue" positions={segments} weight={4} />
        </Map>
    );
}
