import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangesSavedSnackbar from "../ChangesSavedSnackbar";
import TrackDeletedSnackbar from "../TrackDeletedSnackbar";

export default function useMainPage() {
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const [changesSavedSnackbar, setChangesSavedSnackbar] = useState(null);
    const [trackDeletedSnackbar, setTrackDeletedSnackbar] = useState(null);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    const navigateToAllTracks = (filterParams, trackDeleted) => {
        const searchParams = filterParams !== null ? `?${new URLSearchParams(filterParams)}` : "";
        navigate(`/tracks${searchParams}`);

        if (trackDeleted) {
            setTrackDeletedSnackbar(<TrackDeletedSnackbar handleRemove={() => setTrackDeletedSnackbar(null)} />);
        } else {
            setTrackDeletedSnackbar(null);
        }
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
        trackDeletedSnackbar,
    };
}
