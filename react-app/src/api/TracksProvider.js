import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "../api/UserProvider";

const TracksContext = React.createContext();

export function useTracks() {
    const context = useContext(TracksContext);

    if (!context) {
        throw new Error("useTracks must be used within a TracksProvider");
    }

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
        trackId = Number(trackId);
        return tracks.find((t) => t.id === trackId);
    };

    const deleteTrack = async (track) => {
        await axios.delete(track.links.delete);
        setTracks(tracks.filter((t) => t.id !== track.id));
    };

    const uploadTracks = async (files, handleUploadFinished) => {
        const calls = files.map((f) => prepareUploadRequest(user.id, f));
        const responses = await Promise.all(calls);

        const successfulResponses = responses.filter((r) => r.status === 201);
        const newTracks = successfulResponses.map((r) => r.data.tracks).flat();
        setTracks([...tracks, ...newTracks]);

        handleUploadFinished(files.length, successfulResponses.length);
    };

    return (
        <TracksContext.Provider value={{ tracks, getTrack, deleteTrack, uploadTracks }}>
            {props.children}
        </TracksContext.Provider>
    );
}

async function prepareUploadRequest(userId, file) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        return await axios.post(`/api/users/${userId}/gpxfiles`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        return error;
    }
}
