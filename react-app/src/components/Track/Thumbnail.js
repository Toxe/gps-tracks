import React from "react";

export default function Thumbnail({ track }) {
    return <img src={track.links.thumbnail} width={128} height={128} alt="track thumbnail" />;
}
