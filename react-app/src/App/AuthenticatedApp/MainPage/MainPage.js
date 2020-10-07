import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthInfo } from "../../../Auth";
import { PageContent } from "../../shared/PageContent";
import { Header } from "../../shared/Header";
import { AllTracks } from "./AllTracks";
import SingleTrack from "./SingleTrack";
import EditTrack from "./EditTrack";
import { Navigation } from "./Navigation";
import { TracksFilterProvider } from "./TracksFilterProvider";
import { TracksSortProvider } from "./TracksSortProvider";
import { TracksSearchProvider } from "./TracksSearchProvider";
import { LastVisitedAllTracksPageProvider } from "./LastVisitedAllTracksPageProvider";

export default function MainPage() {
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return (
        <TracksFilterProvider>
            <TracksSearchProvider>
                <TracksSortProvider>
                    <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
                    <Navigation
                        mobileNavigationOpen={mobileNavigationOpen}
                        handleMobileNavigationToggle={handleMobileNavigationToggle}
                    />
                    <PageContent>
                        <LastVisitedAllTracksPageProvider>
                            <Routes>
                                <Route path="tracks" element={<AllTracks />} />
                                <Route path="tracks/:trackId" element={<SingleTrack />} />
                                <Route path="tracks/:trackId/edit" element={<EditTrack />} />
                                <Route path="*" element={<Navigate to="/tracks" replace />} />
                            </Routes>
                        </LastVisitedAllTracksPageProvider>
                        {Boolean(parseInt(process.env.REACT_APP_AUTH_INFO)) && <AuthInfo />}
                    </PageContent>
                </TracksSortProvider>
            </TracksSearchProvider>
        </TracksFilterProvider>
    );
}
