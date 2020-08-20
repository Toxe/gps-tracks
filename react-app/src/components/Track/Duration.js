import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Tooltip } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(0.5),
        fontSize: theme.typography.body1.fontSize,
    },
}));

export default function Duration({ duration }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const hours = Math.floor(duration / 3600.0).toString().padStart(2, "0");
    const minutes = Math.round((duration - 3600.0 * hours) / 60.0).toString().padStart(2, "0");

    return (
        <Tooltip arrow title={t("track_duration")}>
            <Box display="flex" alignItems="center">
                <TimerIcon className={classes.icon} />
                <Typography variant="body1">{`${hours}:${minutes}`}</Typography>
            </Box>
        </Tooltip>
    );
}
