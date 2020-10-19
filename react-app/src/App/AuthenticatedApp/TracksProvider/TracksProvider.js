import React, { useState, useEffect, useContext } from "react";
import { GPXFiles, Tracks, Users } from "../api";
import { useUser } from "../UserProvider";

const TracksContext = React.createContext();

export function useTracks() {
    const context = useContext(TracksContext);

    if (!context) {
        throw new Error("useTracks must be used within a TracksProvider");
    }

    return context;
}

export function TracksProvider({ children }) {
    const { user } = useUser();
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        async function queryTracks(user) {
            setTracks(await Users.tracks(user));
        }

        if (user) {
            queryTracks(user);
        } else {
            setTracks([]);
        }
    }, [user]);

    const getTrack = (trackId) => {
        trackId = Number(trackId);
        return tracks.find((t) => t.id === trackId);
    };

    const updateTrack = async (track, values) => {
        const updatedTrack = await Tracks.update(track, values);
        setTracks(tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t)));
    };

    const deleteTrack = async (track) => {
        await Tracks.delete(track);
        setTracks(tracks.filter((t) => t.id !== track.id));
    };

    const uploadTracks = async (files, handleUploadFinished) => {
        const calls = files.map((f) => GPXFiles.upload(user, f));
        const responses = await Promise.all(calls);

        const successfulResponses = responses.filter((r) => r.status === 201);
        const newTracks = successfulResponses.map((r) => r.data.tracks).flat();
        setTracks([...tracks, ...newTracks]);

        handleUploadFinished(files.length, successfulResponses.length);
    };

    return (
        <TracksContext.Provider value={{ tracks, getTrack, updateTrack, deleteTrack, uploadTracks }}>
            {children}
        </TracksContext.Provider>
    );
}
