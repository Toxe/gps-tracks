import React from "react";
import { Typography } from "@material-ui/core";

export default function Distance({ distance }) {
    const km = Number.parseFloat(distance) / 1000.0;

    return <Typography variant="body1">{km.toFixed(2)} km</Typography>;
}
