import React from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "../components/TracksFilter/TracksFilter";
import TracksSort from "../components/TracksSort/TracksSort";
import TracksCounter from "../components/TracksCounter";
import SearchField from "../components/TracksSearch/SearchField";
import { useTracksFilter } from "../components/TracksFilter/TracksFilterProvider";
import { useTracksSort } from "../components/TracksSort/TracksSortProvider";
import { useTracksSearch } from "../components/TracksSearch/TracksSearchProvider";

export default function AllTracks() {
    const { filterTracks } = useTracksFilter();
    const { sortTracks } = useTracksSort();
    const { searchTracks } = useTracksSearch();

    const sortedTracks = sortTracks(searchTracks(filterTracks()));

    return (
        <>
            <Typography variant="h5">
                <TracksCounter tracks={sortedTracks} />
            </Typography>
            <Box display="flex" alignItems="flex-end">
                <TracksFilter />
                <SearchField />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <Box mt={2}>
                {sortedTracks.map((track) => (
                    <Track key={track.id} track={track} />
                ))}
            </Box>
        </>
    );
}
