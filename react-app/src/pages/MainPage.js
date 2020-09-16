import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import AllTracks from "../content/AllTracks";
import SingleTrack from "../content/SingleTrack";
import AuthInfo from "../Auth/AuthInfo";
import { TracksProvider } from "../api/TracksProvider";
import { TracksFilterProvider } from "../components/TracksFilter/TracksFilterProvider";
import { TracksSortProvider } from "../components/TracksSort/TracksSortProvider";
import { TracksSearchProvider } from "../components/TracksSearch/TracksSearchProvider";
import { LastVisitedAllTracksPageProvider } from "../components/DeleteTrack/LastVisitedAllTracksPageProvider";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

export default function MainPage() {
    const classes = useStyles();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return (
        <TracksProvider>
            <TracksFilterProvider>
                <TracksSearchProvider>
                    <TracksSortProvider>
                        <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
                        <Navigation
                            mobileNavigationOpen={mobileNavigationOpen}
                            handleMobileNavigationToggle={handleMobileNavigationToggle}
                        />
                        <Box flexGrow={1} p={3}>
                            <div className={classes.toolbar} />
                            <LastVisitedAllTracksPageProvider>
                                <Routes>
                                    <Route path="tracks" element={<AllTracks />} />
                                    <Route path="tracks/:trackId" element={<SingleTrack />} />
                                    <Route path="*" element={<Navigate to="/tracks" replace />} />
                                </Routes>
                            </LastVisitedAllTracksPageProvider>
                            {Boolean(parseInt(process.env.REACT_APP_AUTH_INFO)) && <AuthInfo />}
                        </Box>
                    </TracksSortProvider>
                </TracksSearchProvider>
            </TracksFilterProvider>
        </TracksProvider>
    );
}
