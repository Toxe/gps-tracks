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

function filterTracks(tracks, activityFilter, yearFilter) {
    if (!tracks || tracks.length === 0)
        return [];

    let filteredTracks = tracks;

    if (activityFilter !== "" && activityFilter !== "all") {
        activityFilter = parseInt(activityFilter);
        filteredTracks = filteredTracks.filter((t) => t.activity_mode === activityFilter);
    }

    if (yearFilter !== "" && yearFilter !== "all") {
        yearFilter = parseInt(yearFilter);
        filteredTracks = filteredTracks.filter((t) => (new Date(t.time_start)).getFullYear() === yearFilter);
    }

    return filteredTracks;
}

export default function AllTracks() {
    const { tracks } = useTracks();
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const filteredTracks = filterTracks(tracks, activityFilter, yearFilter);
    const sortedTracks = sortTracks(filteredTracks, sortBy, sortOrder);

    return (
        <>
            <Typography variant="h5">
                <TracksCounter tracks={sortedTracks} />
            </Typography>
            <Box display="flex">
                <TracksFilter tracks={tracks} activityFilter={activityFilter} yearFilter={yearFilter} setActivityFilter={setActivityFilter} setYearFilter={setYearFilter} />
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
