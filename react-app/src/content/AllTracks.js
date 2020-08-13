import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "./TracksFilter";
import TracksSort from "./TracksSort";
import { useTracks } from "../api/TracksProvider";
import TracksCounter from "../components/TracksCounter";

const compareFunctions = {
    date: (a, b) => new Date(a.time_start) - new Date(b.time_start),
    distance: (a, b) => a.length3d - b.length3d,
    name: (a, b) => a.title.localeCompare(b.title),
};

function compare(sortBy, sortOrder) {
    const cmp = compareFunctions[sortBy];

    return sortOrder === "asc" ? (a, b) => cmp(a, b) :
                                 (a, b) => cmp(b, a);
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
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const sortedTracks = sortTracks(tracks, sortBy, sortOrder);

    return (
        <>
            <Typography variant="h5">
                <TracksCounter tracks={sortedTracks} />
            </Typography>
            <Box display="flex">
                <TracksFilter activityFilter={activityFilter} yearFilter={yearFilter} setActivityFilter={setActivityFilter} setYearFilter={setYearFilter} />
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
