import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { useTracks } from "../../api/TracksProvider";
import DeleteIcon from "@material-ui/icons/Delete";
import { useLastVisitedAllTracksPage } from "./LastVisitedAllTracksPageProvider";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DeleteTrackButton({ track, updateRequestError }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [dialogVisible, setDialogVisible] = useState(false);
    const { deleteTrack } = useTracks();
    const { returnToLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();

    if (!track) {
        return null;
    }

    const handleOpen = () => {
        setDialogVisible(true);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const handleSubmit = async () => {
        setDialogVisible(false);

        try {
            await deleteTrack(track.id);
            updateRequestError(null);
            returnToLastVisitedAllTracksPage();
        } catch (error) {
            updateRequestError(error);
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                className={classes.button}
                onClick={handleOpen}>
                {t("button_delete_track")}
            </Button>
            <Dialog open={dialogVisible} onClose={handleCancel}>
                <DialogTitle>{t("delete_track_title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t("delete_track_text")}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">{t("button_cancel")}</Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>{t("delete_track_submit")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
