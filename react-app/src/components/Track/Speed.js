import React from "react";
import { Typography } from "@material-ui/core";

export default function Speed({ speed }) {
    const kph = Number.parseFloat(speed);

    return <Typography variant="body1">{kph.toFixed(2)} km/h</Typography>;
}
