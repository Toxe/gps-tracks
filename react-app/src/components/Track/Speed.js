import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Tooltip } from "@material-ui/core";
import SpeedIcon from "@material-ui/icons/Speed";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(0.5),
        fontSize: theme.typography.body1.fontSize,
    },
}));

export default function Speed({ speed }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const kph = Number.parseFloat(speed);

    return (
        <Tooltip arrow title={t("track_speed")}>
            <Box display="flex" alignItems="center">
                <SpeedIcon className={classes.icon} />
                <Typography variant="body1">{kph.toFixed(2)} km/h</Typography>
            </Box>
        </Tooltip>
    );
}
