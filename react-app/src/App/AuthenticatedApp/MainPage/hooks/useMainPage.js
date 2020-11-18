import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangesSavedSnackbar from "../ChangesSavedSnackbar";

export default function useMainPage() {
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const [changesSavedSnackbar, setChangesSavedSnackbar] = useState(null);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    const navigateToAllTracks = (filterParams) => {
        const searchParams = filterParams !== null ? `?${new URLSearchParams(filterParams)}` : "";
        navigate(`/tracks${searchParams}`);
    };

    const navigateToSingleTrack = (trackId, changesSaved) => {
        navigate(`/tracks/${trackId}`);

        if (changesSaved) {
            setChangesSavedSnackbar(<ChangesSavedSnackbar handleRemove={() => setChangesSavedSnackbar(null)} />);
        } else {
            setChangesSavedSnackbar(null);
        }
    };

    const navigateToEditTrack = (trackId) => {
        navigate(`/tracks/${trackId}/edit`);
    };

    return {
        mobileNavigationOpen,
        handleMobileNavigationToggle,
        navigateToAllTracks,
        navigateToSingleTrack,
        navigateToEditTrack,
        changesSavedSnackbar,
    };
}
