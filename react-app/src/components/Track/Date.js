import React from "react";
import { Typography } from "@material-ui/core";

export default function Date({ time }) {
    return <Typography variant="body2" color="textSecondary">{time}</Typography>;
}
