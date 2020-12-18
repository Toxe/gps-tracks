import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
    link: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
}));

export default function BackToTracksButton({ handleBackToTracks }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Link className={classes.link} component="button" variant="body1" underline="none" onClick={handleBackToTracks}>
            <ArrowBackIcon />
            {t("button_back_to_list_of_tracks")}
        </Link>
    );
}
