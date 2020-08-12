import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Header from "../content/Header";
import Navigation from "../content/Navigation";
import MainLanding from "../content/MainLanding";
import AllTracks from "../content/AllTracks";
import SingleTrack from "../content/SingleTrack";
import AuthInfo from "../Auth/AuthInfo";
import { useUser } from "../api/UserProvider";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

export default function MainPage() {
    const classes = useStyles();
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const { user } = useUser();
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        async function queryTracks(user) {
            const response = await axios.get(user.links.tracks);
            setTracks(response.data);
        }

        if (user) {
            queryTracks(user);
        }
    }, [user]);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return (
        <>
            <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <Navigation
                tracks={tracks}
                mobileNavigationOpen={mobileNavigationOpen}
                handleMobileNavigationToggle={handleMobileNavigationToggle}
            />
            <Box flexGrow={1} p={3}>
                <div className={classes.toolbar} />
                <Routes>
                    <Route path="/" element={<MainLanding />} />
                    <Route path="tracks" element={<AllTracks tracks={tracks} />} />
                    <Route path="tracks/:trackId" element={<SingleTrack />} />
                </Routes>
                <AuthInfo />
            </Box>
        </>
    );
}
