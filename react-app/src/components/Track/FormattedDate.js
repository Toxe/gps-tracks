import React from "react";
import { Typography } from "@material-ui/core";

export default function FormattedDate({ time }) {
    return <Typography variant="body2" color="textSecondary">{time}</Typography>;
}
