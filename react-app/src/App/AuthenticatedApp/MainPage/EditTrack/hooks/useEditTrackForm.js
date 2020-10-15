import { useState, useEffect } from "react";

export default function useEditTrackForm(track) {
    const [formValues, setFormValues] = useState(null);
    const [formValuesChanged, setFormValuesChanged] = useState(false);

    useEffect(() => {
        if (track) {
            setFormValues({ activity_mode: track.activity_mode, title: track.title });
        }
    }, [track]);

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

    return { formValues, formValuesChanged, handleChange };
}
