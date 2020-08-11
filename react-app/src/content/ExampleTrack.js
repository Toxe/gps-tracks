import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Link, Paper, Typography } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

const useStyles = makeStyles((theme) => ({
    track: {
        marginBottom: theme.spacing(2),
    },
    trackThumbnail: {
        width: 128,
        height: 128,
        backgroundColor: "lightgrey",
    },
}));

export default function ExampleTrack({ id, activity }) {
    const classes = useStyles();

    return (
        <Paper square className={classes.track}>
            <Box display="flex">
                <Box>
                    <div className={classes.trackThumbnail} />
                </Box>
                <Box flexGrow={1} m={1}>
                    <Typography variant="h6">
                        <Link component={RouterLink} to={`/tracks/${id}`} color="inherit" underline="none">
                            {activity === "bike" ? "Bike Ride" : "Hiking"}
                        </Link>
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item>
                            {activity === "bike" && <DirectionsBikeIcon fontSize="small" />}
                            {activity === "hiking" && <DirectionsWalkIcon fontSize="small" />}
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">25 km</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">1:30 h</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">12 km/h</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="textSecondary">
                        25.07.2020
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
