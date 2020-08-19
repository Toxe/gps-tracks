import React from "react";
import { Typography } from "@material-ui/core";

export default function Duration({ duration }) {
    const h = new Date(duration * 1000.0).toISOString().substr(11, 5);

    return <Typography variant="body1">{h}</Typography>;
}
