import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { ActivityMode } from "../../../../../utils/enums";
import StatsRow from "./StatsRow";
import TotalRow from "./TotalRow";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: 5,
        marginBottom: theme.spacing(3),
    },
}));

export function generateStats(allTracks, activity) {
    if (!allTracks || allTracks.length === 0) {
        return undefined;
    }

    const tracks = allTracks.filter((t) => t.activity_mode === activity);
    const count = tracks.length;

    if (count === 0) {
        return undefined;
    }

    const distance = tracks.reduce((sum, t) => sum + t.length3d, 0.0);
    const duration = tracks.reduce((sum, t) => sum + t.moving_time, 0.0);

    return { activity, distance, count, duration };
}

export default function TracksSummary({ tracks }) {
    const classes = useStyles();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const map = new Map();
        const bikeStats = generateStats(tracks, ActivityMode.BIKE);
        const hikingStats = generateStats(tracks, ActivityMode.HIKING);

        if (bikeStats) {
            map.set(ActivityMode.BIKE, bikeStats);
        }

        if (hikingStats) {
            map.set(ActivityMode.HIKING, hikingStats);
        }

        setStats(map);
    }, [tracks]);

    if (!stats || stats.size === 0) {
        return null;
    }

    return (
        <Paper elevation={2} className={classes.paper}>
            <table>
                <tbody>
                    <StatsRow stats={stats} activity={ActivityMode.BIKE} />
                    <StatsRow stats={stats} activity={ActivityMode.HIKING} />
                    {stats.size > 1 && <TotalRow stats={stats} />}
                </tbody>
            </table>
        </Paper>
    );
}
