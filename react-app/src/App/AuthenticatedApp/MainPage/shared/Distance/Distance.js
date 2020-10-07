import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    bold: {
        fontWeight: "bold",
    },
}));

export default function Distance({ distance, bold }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const km = Number.parseFloat(distance) / 1000.0;

    return (
        <Tooltip arrow title={t("track_distance")}>
            <Typography variant="body1" className={bold && classes.bold}>{km.toFixed(2)} km</Typography>
        </Tooltip>
    );
}
