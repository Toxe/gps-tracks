import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracks } from "../../../TracksProvider";
import { countActivities, countYears } from "../tracksStats";

export default function useNavigation(mobileNavigationOpen, handleMobileNavigationToggle) {
    const navigate = useNavigate();
    const { tracks } = useTracks();
    const [countedYears, setCountedYears] = useState(null);
    const [countedActivities, setCountedActivities] = useState(null);

    useEffect(() => {
        setCountedYears(countYears(tracks));
        setCountedActivities(countActivities(tracks));
    }, [tracks]);

    const handleNavigationClick = (redirectURL) => {
        if (mobileNavigationOpen) {
            handleMobileNavigationToggle();
        }

        navigate(redirectURL);
    };

    const numTracks = tracks ? tracks.length : 0;

    return { numTracks, countedYears, countedActivities, handleNavigationClick };
}
