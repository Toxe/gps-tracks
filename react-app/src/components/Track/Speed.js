import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import SpeedIcon from "@material-ui/icons/Speed";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: 4,
    },
}));

export default function Speed({ speed }) {
    const classes = useStyles();
    const kph = Number.parseFloat(speed);

    return (
        <Typography variant="body1">
            <Box display="flex" alignItems="center">
                <SpeedIcon fontSize="inherit" className={classes.icon} />
                {kph.toFixed(2)} km/h
            </Box>
        </Typography>
    );
}
