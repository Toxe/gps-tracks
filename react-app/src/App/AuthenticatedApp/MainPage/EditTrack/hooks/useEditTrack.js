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
    const [formValues, setFormValues] = useState(null);
    const [formValuesChanged, setFormValuesChanged] = useState(false);

    useEffect(() => {
        const t = getTrack(trackId);
        setTrack(t);

        if (t) {
            setFormValues({ activity_mode: t.activity_mode, title: t.title });
        }
    }, [trackId, getTrack]);

    useEffect(() => {
        if (track && formValues) {
            setFormValuesChanged(formValues.title !== track.title || formValues.activity_mode !== track.activity_mode);
        } else {
            setFormValuesChanged(false);
        }
    }, [track, formValues]);

    const handleChange = (e) => {
        const value = e.target.name === "activity_mode" ? Number(e.target.value) : e.target.value;
        setFormValues({ ...formValues, [e.target.name]: value });
    };

    const handleSave = async () => {
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

    return { track, formValues, formValuesChanged, requestError, handleChange, handleSave, handleCancel };
}
