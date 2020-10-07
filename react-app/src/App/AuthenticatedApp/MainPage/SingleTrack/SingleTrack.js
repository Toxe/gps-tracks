import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import { useTracks } from "../../TracksProvider";
import { Track } from "../../../../components/Track";
import TrackNotFound from "../../../../components/TrackNotFound/TrackNotFound";
import TrackMap from "./TrackMap";
import TrackDetails from "./TrackDetails";
import DownloadTrackButton from "./DownloadTrackButton";
import EditTrackButton from "./EditTrackButton";
import DeleteTrackButton from "./DeleteTrackButton";
import RequestError from "../../../../utils/RequestError";

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
