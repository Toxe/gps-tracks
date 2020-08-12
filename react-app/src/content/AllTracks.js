import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "./TracksFilter";
import TracksSort from "./TracksSort";
import { useTracks } from "../api/TracksProvider";
import TracksCounter from "../components/TracksCounter";

function compareDate(sortOrder) {
    if (sortOrder === "asc") {
        return (a, b) => {
            const d1 = new Date(a.time_start);
            const d2 = new Date(b.time_start);
            return d1 - d2;
        };
    } else {
        return (a, b) => {
            const d1 = new Date(a.time_start);
            const d2 = new Date(b.time_start);
            return d2 - d1;
        };
    }
}

function compareDistance(sortOrder) {
    if (sortOrder === "asc") {
        return (a, b) => a.length3d - b.length3d;
    } else {
        return (a, b) => b.length3d - a.length3d;
    }
}

function compareName(sortOrder) {
    if (sortOrder === "asc") {
        return (a, b) => {
            const s1 = a.title.toLowerCase();
            const s2 = b.title.toLowerCase();

            if (s1 < s2)
                return -1;

            return s2 > s1 ? 1 : 0;
        };
    } else {
        return (a, b) => {
            const s1 = a.title.toLowerCase();
            const s2 = b.title.toLowerCase();

            if (s2 < s1)
                return -1;

            return s1 > s2 ? 1 : 0;
        };
    }
}

function compare(sortBy, sortOrder) {
    if (sortBy === "date") {
        return compareDate(sortOrder);
    } else if (sortBy === "distance") {
        return compareDistance(sortOrder);
    } else {
        return compareName(sortOrder);
    }
}

function sortTracks(tracks, sortBy, sortOrder) {
    if (!tracks || tracks.length === 0)
        return [];

    return [...tracks].sort(compare(sortBy, sortOrder));
}

export default function AllTracks() {
    const { tracks } = useTracks();
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedTracks = sortTracks(tracks, sortBy, sortOrder);

    return (
        <>
            <Typography variant="h5">
                <TracksCounter tracks={sortedTracks} />
            </Typography>
            <Box display="flex">
                <TracksFilter />
                <Box flexGrow={1} />
                <TracksSort sortBy={sortBy} sortOrder={sortOrder} setSortBy={setSortBy} setSortOrder={setSortOrder} />
            </Box>
            <Box mt={2}>
                {sortedTracks.map((track) => (
                    <Track key={track.id} track={track} />
                ))}
            </Box>
        </>
    );
}
