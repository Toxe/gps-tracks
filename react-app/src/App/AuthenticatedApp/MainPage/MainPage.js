import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthInfo } from "../../../Auth";
import { Header, PageContent } from "../../shared";
import { AllTracks } from "./AllTracks";
import { SingleTrack } from "./SingleTrack";
import { EditTrack } from "./EditTrack";
import { Navigation } from "./Navigation";
import { MainPageProviders } from "./MainPageProviders";
import { useMainPage } from "./hooks";

export default function MainPage() {
    const {
        mobileNavigationOpen,
        handleMobileNavigationToggle,
        navigateToSingleTrack,
        navigateToEditTrack,
    } = useMainPage();

    return (
        <MainPageProviders>
            <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <Navigation
                mobileNavigationOpen={mobileNavigationOpen}
                handleMobileNavigationToggle={handleMobileNavigationToggle}
            />
            <PageContent>
                <Routes>
                    <Route path="tracks" element={<AllTracks />} />
                    <Route path="tracks/:trackId" element={<SingleTrack navigateToEditTrack={navigateToEditTrack} />} />
                    <Route path="tracks/:trackId/edit" element={<EditTrack navigateToSingleTrack={navigateToSingleTrack} />} />
                    <Route path="*" element={<Navigate to="/tracks" replace />} />
                </Routes>
                {Boolean(parseInt(process.env.REACT_APP_AUTH_INFO)) && <AuthInfo />}
            </PageContent>
        </MainPageProviders>
    );
}
