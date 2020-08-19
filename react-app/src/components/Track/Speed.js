import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import SpeedIcon from "@material-ui/icons/Speed";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(0.5),
        fontSize: theme.typography.body1.fontSize,
    },
}));

export default function Speed({ speed }) {
    const classes = useStyles();
    const kph = Number.parseFloat(speed);

    return (
        <Box display="flex" alignItems="center">
            <SpeedIcon className={classes.icon} />
            <Typography variant="body1">{kph.toFixed(2)} km/h</Typography>
        </Box>
    );
}
