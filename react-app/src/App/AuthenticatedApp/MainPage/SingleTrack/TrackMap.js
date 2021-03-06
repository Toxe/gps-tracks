import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { useTrackMap } from "./hooks";

const useStyles = makeStyles((theme) => ({
    map: {
        height: 600,
        width: "100%",
    },
}));

export default function TrackMap({ track }) {
    const classes = useStyles();
    const { segments, bounds } = useTrackMap(track);

    if (!segments || !bounds) {
        return null;
    }

    return (
        <MapContainer bounds={bounds} className={classes.map}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline color="blue" positions={segments} weight={4} />
        </MapContainer>
    );
}
