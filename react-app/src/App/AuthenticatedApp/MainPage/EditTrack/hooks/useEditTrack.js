import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RequestError } from "../../../../../shared";
import { useTracks } from "../../../TracksProvider";

export default function useEditTrack() {
    const navigate = useNavigate();
    const { trackId } = useParams();
    const { getTrack, updateTrack } = useTracks();
    const [track, setTrack] = useState(null);
    const [requestError, setRequestError] = useState(null);

    useEffect(() => {
        const t = getTrack(trackId);
        setTrack(t);
    }, [trackId, getTrack]);

    const handleSave = async (formValues) => {
        if (!formValues) {
            throw new TypeError("invalid arguments");
        }

        try {
            await updateTrack(track, formValues);
            navigate(`/tracks/${track.id}`);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    };

    const handleCancel = () => {
        navigate(`/tracks/${track.id}`);
    };

    return { track, requestError, handleSave, handleCancel };
}
