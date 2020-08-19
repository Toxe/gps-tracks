import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(0.5),
    },
}));

export default function Duration({ duration }) {
    const classes = useStyles();
    const h = new Date(duration * 1000.0).toISOString().substr(11, 5);

    return (
        <Typography variant="body1">
            <Box display="flex" alignItems="center">
                <TimerIcon fontSize="inherit" className={classes.icon} />
                {h}
            </Box>
        </Typography>
    );
}
