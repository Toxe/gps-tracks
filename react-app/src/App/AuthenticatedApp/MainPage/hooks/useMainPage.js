import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAlertSnackbar } from "../shared";

export default function useMainPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const [changesSavedSnackbar, showChangesSavedSnackbar, hideChangesSavedSnackbar] = useAlertSnackbar();
    const [trackDeletedSnackbar, showTrackDeletedSnackbar, hideTrackDeletedSnackbar] = useAlertSnackbar();

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    const navigateToAllTracks = (filterParams, trackDeleted) => {
        const searchParams = filterParams !== null ? `?${new URLSearchParams(filterParams)}` : "";
        navigate(`/tracks${searchParams}`);

        if (trackDeleted) {
            showTrackDeletedSnackbar(t("track_deleted"));
        } else {
            hideTrackDeletedSnackbar();
        }
    };

    const navigateToSingleTrack = (trackId, changesSaved) => {
        navigate(`/tracks/${trackId}`);

        if (changesSaved) {
            showChangesSavedSnackbar(t("changes_saved"));
        } else {
            hideChangesSavedSnackbar();
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
