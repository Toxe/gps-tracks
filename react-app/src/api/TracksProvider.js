import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "../api/UserProvider";

const TracksContext = React.createContext();

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

    return <TracksContext.Provider value={{ tracks }}>{props.children}</TracksContext.Provider>;
}

export function useTracks() {
    const context = useContext(TracksContext);

    if (!context)
        throw new Error("useTracks must be used within a TracksProvider");

    return context;
}
