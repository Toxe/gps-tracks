import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";

export default function Thumbnail({ track }) {
    return (
        <Link component={RouterLink} to={`/tracks/${track.id}`}>
            <img src={track.links.thumbnail} width={128} height={128} alt="track thumbnail" />
        </Link>
    );
}
