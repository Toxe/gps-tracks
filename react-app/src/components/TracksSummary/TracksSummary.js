import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { ActivityMode } from "../../utils/Enums";
import StatsRow from "./StatsRow";
import TracksCounter from "../TracksCounter";

const useStyles = makeStyles(() => ({
    table: {
        "& td": {},
    },
}));

function generateStats(allTracks, activity) {
    if (!allTracks || allTracks.length === 0)
        return null;

    const tracks = allTracks.filter((t) => t.activity_mode === activity);
    const distance = tracks.reduce((sum, t) => sum + t.length3d, 0.0);
    const duration = tracks.reduce((sum, t) => sum + t.moving_time, 0.0);
    const count = tracks.length;

    return { activity, distance, count, duration };
}

export default function TracksSummary({ tracks }) {
    const classes = useStyles();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setStats(
            new Map([
                [ActivityMode.BIKE, generateStats(tracks, ActivityMode.BIKE)],
                [ActivityMode.HIKING, generateStats(tracks, ActivityMode.HIKING)],
            ])
        );
    }, [tracks]);

    if (!stats)
        return null;

    return (
        <div>
            <Typography variant="h5">
                <TracksCounter count={tracks.length} />
            </Typography>
            <table className={classes.table}>
                <tbody>
                    <StatsRow stats={stats.get(ActivityMode.BIKE)} />
                    <StatsRow stats={stats.get(ActivityMode.HIKING)} />
                </tbody>
            </table>
        </div>
    );
}
