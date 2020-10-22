import { useState, useEffect } from "react";
import { ActivityMode } from "../../../utils/enums";

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

export default function useSummary(tracks) {
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

    return { stats };
}
