import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Typography } from "@material-ui/core";

export default function Title({ id, title }) {
    return (
        <Typography variant="h6">
            <Link component={RouterLink} to={`/tracks/${id}`} color="inherit" underline="none">
                {title}
            </Link>
        </Typography>
    );
}
