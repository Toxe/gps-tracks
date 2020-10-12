import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { RequestError } from "../../../../../shared/RequestError";
import { Tracks } from "../../../api";
import { useTracks } from "../../../TracksProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";

export default function useSingleTrack() {
    const { trackId } = useParams();
    const { getTrack, deleteTrack } = useTracks();
    const { returnToLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();
    const [track, setTrack] = useState(undefined);
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

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

    const handleDownloadTrack = async () => {
        try {
            updateRequestError(null);
            const filename = track.links.download.split("/").pop();
            const blob = await Tracks.download(track);
            saveAs(blob, filename);
        } catch (error) {
            updateRequestError(error);
        }
    };

    const handleDeleteTrack = async () => {
        try {
            await deleteTrack(track);
            updateRequestError(null);
            returnToLastVisitedAllTracksPage();
        } catch (error) {
            updateRequestError(error);
        }
    };

    const handleEditTrack = () => {
        navigate("edit");
    };

    return { track, requestError, handleDownloadTrack, handleDeleteTrack, handleEditTrack };
}
