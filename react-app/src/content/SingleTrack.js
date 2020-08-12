import React from "react";
import { useParams } from "react-router-dom";
import Track from "./Track";
import { useTracks } from "../api/TracksProvider";

export default function SingleTrack() {
    const { trackId } = useParams();
    const { getTrack } = useTracks();
    const track = getTrack(trackId);

    if (!track)
        return null;

    return <Track track={track} />;
}
