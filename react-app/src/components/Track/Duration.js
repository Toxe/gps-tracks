import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";

const useStyles = makeStyles((theme) => ({
    bold: {
        fontWeight: "bold",
    },
    icon: {
        marginRight: theme.spacing(0.5),
        fontSize: theme.typography.body1.fontSize,
    },
    div: {
        display: "flex",
        alignItems: "center",
    },
}));

export default function Duration({ duration, bold }) {
    if (duration < 0.0)
        duration = 0.0;

    const { t } = useTranslation();
    const classes = useStyles();
    const hours = Math.floor(duration / 3600.0).toString().padStart(2, "0");
    const minutes = Math.round((duration - 3600.0 * hours) / 60.0).toString().padStart(2, "0");

    return (
        <Tooltip arrow title={t("track_duration")}>
            <div className={classes.div}>
                <TimerIcon className={classes.icon} />
                <Typography variant="body1" className={bold && classes.bold}>{`${hours}:${minutes}`}</Typography>
            </div>
        </Tooltip>
    );
}
