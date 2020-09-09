import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Paper } from "@material-ui/core";
import ActivityIcon from "./ActivityIcon";
import FormattedDate from "./FormattedDate";
import Distance from "./Distance";
import Duration from "./Duration";
import Speed from "./Speed";
import Thumbnail from "./Thumbnail";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
    track: {
        marginBottom: theme.spacing(2),
    },
    smallGap: {
        marginLeft: theme.spacing(1),
    },
    wideGap: {
        marginLeft: theme.spacing(4),
    },
}));

export default function Track({ track }) {
    const classes = useStyles();

    if (!track)
        return null;

    return (
        <Paper square className={classes.track}>
            <Box display="flex">
                <Thumbnail track={track} />
                <Box flexGrow={1} m={1}>
                    <Title id={track.id} title={track.title}/>
                    <Grid container>
                        <Grid item><ActivityIcon activity={track.activity_mode} /></Grid>
                        <Grid item className={classes.smallGap}><Distance distance={track.length3d} /></Grid>
                        <Grid item className={classes.wideGap}><Duration duration={track.moving_time} /></Grid>
                        <Grid item className={classes.wideGap}><Speed speed={track.avg_speed} /></Grid>
                    </Grid>
                    <FormattedDate time={track.time_start} />
                </Box>
            </Box>
        </Paper>
    );
}
