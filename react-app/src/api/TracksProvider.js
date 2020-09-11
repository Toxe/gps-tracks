import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "../api/UserProvider";

const TracksContext = React.createContext();

export function useTracks() {
    const context = useContext(TracksContext);

    if (!context)
        throw new Error("useTracks must be used within a TracksProvider");

    return context;
}

export function TracksProvider(props) {
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

    const getTrack = (trackId) => {
        trackId = parseInt(trackId);
        return tracks.find((t) => t.id === trackId);
    };

    const deleteTrack = async (userId, trackId) => {
        userId = parseInt(userId);
        trackId = parseInt(trackId);
        await axios.delete(`/api/users/${userId}/tracks/${trackId}`);
        setTracks(tracks.filter((t) => t.id !== trackId));
    };

    return <TracksContext.Provider value={{ tracks, getTrack, deleteTrack }}>{props.children}</TracksContext.Provider>;
}
