import { useEffect, useState } from "react";
import { useTracks } from "../../../TracksProvider";

export default function useNavigation(mobileNavigationOpen, handleMobileNavigationToggle, navigateToAllTracks) {
    const { tracks } = useTracks();
    const [countedYears, setCountedYears] = useState(null);
    const [countedActivities, setCountedActivities] = useState(null);

    useEffect(() => {
        setCountedYears(countYears(tracks));
        setCountedActivities(countActivities(tracks));
    }, [tracks]);

    const handleNavigationClick = (filterParams) => {
        if (mobileNavigationOpen) {
            handleMobileNavigationToggle();
        }

        navigateToAllTracks(filterParams);
    };

    const numTracks = tracks ? tracks.length : 0;

    return { numTracks, countedYears, countedActivities, handleNavigationClick };
}

function countYears(tracks) {
    if (!tracks || tracks.length === 0) {
        return undefined;
    }

    const map = new Map();

    tracks.forEach((t) => {
        const date = new Date(t.time_start);
        const year = date.getFullYear();
        const count = map.get(year);
        map.set(year, count === undefined ? 1 : count + 1);
    });

    return map;
}

function countActivities(tracks) {
    if (!tracks || tracks.length === 0) {
        return undefined;
    }

    const map = new Map();

    tracks.forEach((t) => {
        const activity = t.activity_mode;
        const count = map.get(activity);
        map.set(activity, count === undefined ? 1 : count + 1);
    });

    return map;
}
