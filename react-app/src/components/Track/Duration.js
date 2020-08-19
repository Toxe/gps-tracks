import React from "react";
import { Typography } from "@material-ui/core";

export default function Duration({ duration }) {
    return <Typography variant="body1">{duration} m</Typography>;
}
