import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function DeleteTrackButton({ track }) {
    const { t } = useTranslation();
    const classes = useStyles();

    if (!track)
        return null;

    return (
        <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} className={classes.button}>
            {t("button_delete_track")}
        </Button>
    );
}
