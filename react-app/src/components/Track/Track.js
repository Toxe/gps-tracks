import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Link, Paper, Typography } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { ActivityMode } from "../../utils/Enums";

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

export default function Track({ track }) {
    const classes = useStyles();

    return (
        <Paper square className={classes.track}>
            <Box display="flex">
                <Box>
                    <div className={classes.trackThumbnail} />
                </Box>
                <Box flexGrow={1} m={1}>
                    <Typography variant="h6">
                        <Link component={RouterLink} to={`/tracks/${track.id}`} color="inherit" underline="none">
                            {track.title}
                        </Link>
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item>
                            {track.activity_mode === ActivityMode.BIKE && <DirectionsBikeIcon fontSize="small" />}
                            {track.activity_mode === ActivityMode.HIKING && <DirectionsWalkIcon fontSize="small" />}
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">{track.length3d} m</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">{track.moving_time} sec</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">{track.avg_speed} km/h</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="textSecondary">
                        {track.time_start}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
