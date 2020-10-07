import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import { RequestError } from "../../../../shared/RequestError";
import { useTracks } from "../../TracksProvider";
import { Track } from "../shared/Track";
import { TrackNotFound } from "../shared/TrackNotFound";
import DownloadTrackButton from "./DownloadTrackButton";
import TrackMap from "./TrackMap";
import TrackDetails from "./TrackDetails";
import EditTrackButton from "./EditTrackButton";
import DeleteTrackButton from "./DeleteTrackButton";

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

    if (!track) {
        return <TrackNotFound />;
    }

    return (
        <div>
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <TrackDetails track={track} />
                <Box flexGrow={1} />
                <EditTrackButton />
                <DownloadTrackButton track={track} updateRequestError={updateRequestError} />
                <DeleteTrackButton track={track} updateRequestError={updateRequestError} />
            </Box>
            {requestError}
            <TrackMap track={track} />
        </div>
    );
}
