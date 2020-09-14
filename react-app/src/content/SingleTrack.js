import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import Track from "../components/Track/Track";
import TrackMap from "../components/TrackMap/TrackMap";
import DownloadTrackButton from "../components/DownloadTrack/DownloadTrackButton";
import DeleteTrackButton from "../components/DeleteTrack/DeleteTrackButton";
import { useTracks } from "../api/TracksProvider";
import RequestError from "../utils/RequestError";

export default function SingleTrack() {
    const { trackId } = useParams();
    const { getTrack } = useTracks();
    const [track, setTrack] = useState(null);
    const [requestError, setRequestError] = useState(null);

    useEffect(() => {
        setTrack(getTrack(trackId));
    }, [trackId, getTrack]);

    const updateRequestError = (error) => {
        if (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        } else {
            setRequestError(null);
        }
    };

    return (
        <div>
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <DownloadTrackButton track={track} updateRequestError={updateRequestError} />
                <DeleteTrackButton track={track} updateRequestError={updateRequestError} />
            </Box>
            {requestError}
            <TrackMap track={track} />
        </div>
    );
}
