import React from "react";
import { useParams } from "react-router-dom";

export default function SingleTrack() {
    const { trackId } = useParams();

    return <div>SingleTrack #{trackId}</div>;
}
