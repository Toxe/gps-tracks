import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDeleteTrackButton } from "./hooks";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DeleteTrackButton({ handleDeleteTrack }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { dialogVisible, handleOpen, handleCancel, handleSubmit } = useDeleteTrackButton(handleDeleteTrack);

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
