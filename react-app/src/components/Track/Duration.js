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
    const h = new Date(duration * 1000.0).toISOString().substr(11, 5);

    return (
        <Tooltip arrow title={t("track_duration")}>
            <Box display="flex" alignItems="center">
                <TimerIcon className={classes.icon} />
                <Typography variant="body1">{h}</Typography>
            </Box>
        </Tooltip>
    );
}
