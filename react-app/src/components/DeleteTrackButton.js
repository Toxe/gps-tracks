import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { useTracks } from "../api/TracksProvider";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DeleteTrackButton({ track, updateRequestError }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [dialogVisible, setDialogVisible] = useState(false);
    const { deleteTrack } = useTracks();

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
            updateRequestError(null);
            await deleteTrack(track.user_id, track.id);
            navigate(-1);
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
                <DialogTitle>Do you really want to delete this track?</DialogTitle>
                <DialogContent>
                    <DialogContentText>The track will be removed and will no longer be available.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        Yes, delete!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
