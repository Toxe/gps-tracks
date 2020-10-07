import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageContent from "../../shared/PageContent";
import Header from "../../../components/Header/Header";
import Navigation from "../../../components/Navigation/Navigation";
import AllTracks from "../../../content/AllTracks";
import SingleTrack from "../../../content/SingleTrack";
import EditTrack from "../../../content/EditTrack";
import { AuthInfo } from "../../../Auth";
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
