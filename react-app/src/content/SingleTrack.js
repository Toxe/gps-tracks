import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Track from "../components/Track/Track";
import TrackMap from "../components/TrackMap/TrackMap";
import TrackDetails from "../components/Track/TrackDetails";
import DownloadTrackButton from "../components/DownloadTrack/DownloadTrackButton";
import DeleteTrackButton from "../components/DeleteTrack/DeleteTrackButton";
import { useTracks } from "../api/TracksProvider";
import RequestError from "../utils/RequestError";

export default function SingleTrack() {
    const { t } = useTranslation();
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
            {!track && (
                <Alert severity="warning">
                    <AlertTitle>{t("details_not_found_title")}</AlertTitle>
                    {t("details_not_found_text")}
                </Alert>
            )}
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <TrackDetails track={track} />
                <Box flexGrow={1} />
                <DownloadTrackButton track={track} updateRequestError={updateRequestError} />
                <DeleteTrackButton track={track} updateRequestError={updateRequestError} />
            </Box>
            {requestError}
            <TrackMap track={track} />
        </div>
    );
}
