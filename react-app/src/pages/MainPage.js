import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Header from "../content/Header";
import Navigation from "../content/Navigation";
import MainLanding from "../content/MainLanding";
import AllTracks from "../content/AllTracks";
import SingleTrack from "../content/SingleTrack";
import AuthInfo from "../Auth/AuthInfo";

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
        <>
            <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <Navigation mobileNavigationOpen={mobileNavigationOpen} handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <Box flexGrow={1} p={3}>
                <div className={classes.toolbar} />
                <Routes>
                    <Route path="/" element={<MainLanding />} />
                    <Route path="tracks" element={<AllTracks />} />
                    <Route path="tracks/:trackId" element={<SingleTrack />} />
                </Routes>
                <AuthInfo />
            </Box>
        </>
    );
}
