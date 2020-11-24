import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAlertSnackbar } from "../shared";

export default function useMainPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const [changesSavedSnackbar, showChangesSavedSnackbar, hideChangesSavedSnackbar] = useAlertSnackbar();
    const [trackDeletedSnackbar, showTrackDeletedSnackbar, hideTrackDeletedSnackbar] = useAlertSnackbar();

    const handleMobileNavigationToggle = useCallback(() => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    }, [mobileNavigationOpen]);

    const navigateToRoot = useCallback(() => navigate("/"), [navigate]);

    const navigateToAllTracks = useCallback(
        (filterParams, trackDeleted) => {
            const searchParams = filterParams !== null ? `?${new URLSearchParams(filterParams)}` : "";
            navigate(`/tracks${searchParams}`);

            if (trackDeleted) {
                showTrackDeletedSnackbar(t("track_deleted"));
            } else {
                hideTrackDeletedSnackbar();
            }
        },
        [showTrackDeletedSnackbar, hideTrackDeletedSnackbar, navigate, t]
    );

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
        navigateToRoot,
        navigateToAllTracks,
        navigateToSingleTrack,
        navigateToEditTrack,
        changesSavedSnackbar,
        trackDeletedSnackbar,
    };
}
