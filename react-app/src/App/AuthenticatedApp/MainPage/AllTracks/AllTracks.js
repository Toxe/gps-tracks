import React from "react";
import { Box } from "@material-ui/core";
import Filter from "./Filter";
import List from "./List";
import Sort from "./Sort";
import { Search } from "./Search";
import { TracksSummary } from "./TracksSummary";
import { useAllTracks } from "./hooks";

export default function AllTracks() {
    const { filteredAndSortedTracks } = useAllTracks();

    return (
        <>
            <TracksSummary tracks={filteredAndSortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <Filter />
                <Search />
                <Box flexGrow={1} />
                <Sort />
            </Box>
            <List tracks={filteredAndSortedTracks} />
        </>
    );
}
