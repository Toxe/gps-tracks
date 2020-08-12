import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "./TracksFilter";
import TracksSort from "./TracksSort";
import { useTracks } from "../api/TracksProvider";
import TracksCounter from "../components/TracksCounter";

function compareDate(a, b) {
    const d1 = new Date(a.time_start);
    const d2 = new Date(b.time_start);

    return d1 - d2;
}

function compareDistance(a, b) {
    return a.length3d - b.length3d;
}

function compareName(a, b) {
    return a.title.localeCompare(b.title);
}

function compare(sortBy, sortOrder) {
    const compareFunctions = {
        date: compareDate,
        distance: compareDistance,
        name: compareName,
    };

    const cmp = compareFunctions[sortBy];

    if (sortOrder === "asc")
        return (a, b) => cmp(a, b);
    else
        return (a, b) => cmp(b, a);
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
