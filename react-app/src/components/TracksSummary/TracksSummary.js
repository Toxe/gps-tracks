import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { ActivityMode } from "../../utils/Enums";
import StatsRow from "./StatsRow";
import TotalRow from "./TotalRow";
import TracksCounter from "../TracksCounter";

function generateStats(allTracks, activity) {
    if (!allTracks || allTracks.length === 0)
        return null;

    const tracks = allTracks.filter((t) => t.activity_mode === activity);
    const count = tracks.length;

    if (count === 0)
        return null;

    const distance = tracks.reduce((sum, t) => sum + t.length3d, 0.0);
    const duration = tracks.reduce((sum, t) => sum + t.moving_time, 0.0);

    return { activity, distance, count, duration };
}

export default function TracksSummary({ tracks }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const map = new Map();
        const bikeStats = generateStats(tracks, ActivityMode.BIKE);
        const hikingStats = generateStats(tracks, ActivityMode.HIKING);

        if (bikeStats)
            map.set(ActivityMode.BIKE, bikeStats);

        if (hikingStats)
            map.set(ActivityMode.HIKING, hikingStats);

        setStats(map);
    }, [tracks]);

    if (!stats || stats.size === 0)
        return null;

    return (
        <div>
            <Typography variant="h5">
                <TracksCounter count={tracks.length} />
            </Typography>
            <table>
                <tbody>
                    <StatsRow stats={stats.get(ActivityMode.BIKE)} />
                    <StatsRow stats={stats.get(ActivityMode.HIKING)} />
                    {stats.size > 1 && <TotalRow stats={stats} />}
                </tbody>
            </table>
        </div>
    );
}
