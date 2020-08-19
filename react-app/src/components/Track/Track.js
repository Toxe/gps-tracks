import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Paper } from "@material-ui/core";
import ActivityIcon from "./ActivityIcon";
import Date from "./Date";
import Distance from "./Distance";
import Duration from "./Duration";
import Speed from "./Speed";
import Thumbnail from "./Thumbnail";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
    track: {
        marginBottom: theme.spacing(2),
    },
}));

export default function Track({ track }) {
    const classes = useStyles();

    return (
        <Paper square className={classes.track}>
            <Box display="flex">
                <Box>
                    <Thumbnail />
                </Box>
                <Box flexGrow={1} m={1}>
                    <Title id={track.id} title={track.title}/>
                    <Grid container spacing={3}>
                        <Grid item><ActivityIcon activity={track.activity_mode} /></Grid>
                        <Grid item><Distance distance={track.length3d} /></Grid>
                        <Grid item><Duration duration={track.moving_time} /></Grid>
                        <Grid item><Speed speed={track.avg_speed} /></Grid>
                    </Grid>
                    <Date time={track.time_start} />
                </Box>
            </Box>
        </Paper>
    );
}
