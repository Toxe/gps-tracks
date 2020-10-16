import React from "react";
import { Box } from "@material-ui/core";
import Filter from "./Filter";
import List from "./List";
import TracksSort from "./TracksSort";
import { TracksSearch } from "./TracksSearch";
import { TracksSummary } from "./TracksSummary";
import { useAllTracks } from "./hooks";

export default function AllTracks() {
    const { filteredAndSortedTracks } = useAllTracks();

    return (
        <>
            <TracksSummary tracks={filteredAndSortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <Filter />
                <TracksSearch />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <List tracks={filteredAndSortedTracks} />
        </>
    );
}
