import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useMainPage() {
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    const navigateToSingleTrack = (trackId) => {
        navigate(`/tracks/${trackId}`);
    };

    return { mobileNavigationOpen, handleMobileNavigationToggle, navigateToSingleTrack };
}
