import { useEffect, useState } from "react";
import { useTracks } from "../../../TracksProvider";
import { countActivities, countYears } from "../tracksStats";

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
