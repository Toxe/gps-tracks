import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useMainPage() {
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    const navigateToAllTracks = (filterParams) => {
        navigate(`/tracks${filterParams}`);
    };

    const navigateToSingleTrack = (trackId) => {
        navigate(`/tracks/${trackId}`);
    };

    const navigateToEditTrack = (trackId) => {
        navigate(`/tracks/${trackId}/edit`);
    };

    return { mobileNavigationOpen, handleMobileNavigationToggle, navigateToAllTracks, navigateToSingleTrack, navigateToEditTrack };
}
