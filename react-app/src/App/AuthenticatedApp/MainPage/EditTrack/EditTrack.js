import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { Button, FormControl, FormLabel, RadioGroup, TextField, Typography } from "@material-ui/core";
import { RequestError } from "../../../../shared/RequestError";
import { useTracks } from "../../TracksProvider";
import { Track } from "../shared/Track";
import { TrackNotFound } from "../shared/TrackNotFound";
import { ActivityMode } from "../utils/enums";
import ActivityRadio from "./ActivityRadio";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(2),
    },
    titleTextfield: {
        marginLeft: theme.spacing(8),
        width: 300,
    },
    buttons: {
        marginTop: theme.spacing(3),
    },
    cancelButton: {
        marginRight: theme.spacing(2),
    },
}));

export default function EditTrack() {
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const { trackId } = useParams();
    const { getTrack, updateTrack } = useTracks();
    const [track, setTrack] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [values, setValues] = useState(null);

    useEffect(() => {
        const t = getTrack(trackId);
        setTrack(t);

        if (t) {
            setValues({ activity_mode: t.activity_mode, title: t.title });
        }
    }, [trackId, getTrack]);

    const handleChange = (e) => {
        const value = e.target.name === "activity_mode" ? Number(e.target.value) : e.target.value;
        setValues({ ...values, [e.target.name]: value });
    };

    const handleCancel = () => {
        navigate(`/tracks/${track.id}`);
    };

    const handleSave = async () => {
        try {
            await updateTrack(track, values);
            navigate(`/tracks/${track.id}`);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    };

    if (!track) {
        return <TrackNotFound />;
    }

    const hasChanges = values.title !== track.title || values.activity_mode !== track.activity_mode;

    return (
        <div>
            <Track track={track} />
            <div>
                <Typography variant="h4" className={classes.title}>
                    <Trans i18nKey="edit_track_title" values={{ title: track.title }} components={{ em: <em /> }} />
                </Typography>
                <FormControl component="fieldset">
                    <FormLabel component="legend">{t("edit_track_label_activity")}</FormLabel>
                    <RadioGroup name="activity_mode" value={values.activity_mode} onChange={handleChange}>
                        <ActivityRadio activity={ActivityMode.BIKE} />
                        <ActivityRadio activity={ActivityMode.HIKING} />
                    </RadioGroup>
                </FormControl>
                <TextField
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    label={t("edit_track_label_title")}
                    className={classes.titleTextfield}
                />
            </div>
            <div className={classes.buttons}>
                <Button variant="contained" onClick={handleCancel} className={classes.cancelButton}>
                    {t("button_cancel")}
                </Button>
                <Button variant="contained" color="primary" disabled={!hasChanges} onClick={handleSave}>
                    {t("button_save_changes")}
                </Button>
            </div>
            {requestError}
        </div>
    );
}
