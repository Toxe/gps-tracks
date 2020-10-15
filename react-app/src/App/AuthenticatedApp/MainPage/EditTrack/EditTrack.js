import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, FormControl, FormLabel, RadioGroup, TextField, Typography } from "@material-ui/core";
import { Track, TrackNotFound } from "../shared";
import { ActivityMode } from "../utils/enums";
import ActivityRadio from "./ActivityRadio";
import { useEditTrack } from "./hooks";

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
    const {
        track,
        formValues,
        formValuesChanged,
        requestError,
        handleChange,
        handleSave,
        handleCancel,
    } = useEditTrack();

    if (!track) {
        return <TrackNotFound />;
    }

    return (
        <div>
            <Track track={track} />
            <div>
                <Typography variant="h4" className={classes.title}>
                    <Trans i18nKey="edit_track_title" values={{ title: track.title }} components={{ em: <em /> }} />
                </Typography>
                <FormControl component="fieldset">
                    <FormLabel component="legend">{t("edit_track_label_activity")}</FormLabel>
                    <RadioGroup name="activity_mode" value={formValues.activity_mode} onChange={handleChange}>
                        <ActivityRadio activity={ActivityMode.BIKE} />
                        <ActivityRadio activity={ActivityMode.HIKING} />
                    </RadioGroup>
                </FormControl>
                <TextField
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    label={t("edit_track_label_title")}
                    className={classes.titleTextfield}
                />
            </div>
            <div className={classes.buttons}>
                <Button variant="contained" onClick={handleCancel} className={classes.cancelButton}>
                    {t("button_cancel")}
                </Button>
                <Button variant="contained" color="primary" disabled={!formValuesChanged} onClick={handleSave}>
                    {t("button_save_changes")}
                </Button>
            </div>
            {requestError}
        </div>
    );
}
