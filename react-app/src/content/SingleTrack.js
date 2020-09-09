import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import Track from "../components/Track/Track";
import TrackMap from "../components/TrackMap/TrackMap";
import DownloadTrackButton from "../components/DownloadTrackButton";
import DeleteTrackButton from "../components/DeleteTrackButton";
import { useTracks } from "../api/TracksProvider";

export default function SingleTrack() {
    const { trackId } = useParams();
    const { getTrack } = useTracks();
    const [track, setTrack] = useState(null);

    useEffect(() => {
        setTrack(getTrack(trackId));
    }, [trackId, getTrack]);

    return (
        <div>
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <DownloadTrackButton track={track} />
                <DeleteTrackButton track={track} />
            </Box>
            <TrackMap track={track} />
        </div>
    );
}
