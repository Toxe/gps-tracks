import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import MainLanding from "../content/MainLanding";
import AllTracks from "../content/AllTracks";
import SingleTrack from "../content/SingleTrack";
import AuthInfo from "../Auth/AuthInfo";
import { TracksProvider } from "../api/TracksProvider";
import { TracksFilterProvider } from "../components/TracksFilter/TracksFilterProvider";
import { TracksSortProvider } from "../components/TracksSort/TracksSortProvider";

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
                <TracksSortProvider>
                    <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
                    <Navigation mobileNavigationOpen={mobileNavigationOpen} handleMobileNavigationToggle={handleMobileNavigationToggle} />
                    <Box flexGrow={1} p={3}>
                        <div className={classes.toolbar} />
                        <Routes>
                            <Route path="/" element={<MainLanding />} />
                            <Route path="tracks" element={<AllTracks />} />
                            <Route path="tracks/:trackId" element={<SingleTrack />} />
                        </Routes>
                        {Boolean(parseInt(process.env.REACT_APP_AUTH_INFO)) && <AuthInfo />}
                    </Box>
                </TracksSortProvider>
            </TracksFilterProvider>
        </TracksProvider>
    );
}
