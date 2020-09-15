import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import ActivityIcon from "./ActivityIcon";
import FormattedDate from "./FormattedDate";
import Distance from "./Distance";
import Duration from "./Duration";
import AverageSpeed from "./AverageSpeed";
import Thumbnail from "./Thumbnail";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
    track: {
        display: "flex",
        marginBottom: theme.spacing(2),
    },
    smallGap: {
        marginLeft: theme.spacing(1),
    },
    wideGap: {
        marginLeft: theme.spacing(4),
    },
    details: {
        flexGrow: 1,
        margin: theme.spacing(1),
    },
}));

export default function Track({ track }) {
    const classes = useStyles();

    if (!track) {
        return null;
    }

    return (
        <Paper square className={classes.track}>
            <Thumbnail track={track} />
            <div className={classes.details}>
                <Title id={track.id} title={track.title}/>
                <Grid container>
                    <Grid item><ActivityIcon activity={track.activity_mode} /></Grid>
                    <Grid item className={classes.smallGap}><Distance distance={track.length3d} /></Grid>
                    <Grid item className={classes.wideGap}><Duration duration={track.moving_time} /></Grid>
                    <Grid item className={classes.wideGap}><AverageSpeed speed={track.avg_speed} /></Grid>
                </Grid>
                <FormattedDate time={track.time_start} />
            </div>
        </Paper>
    );
}
