import React from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "../components/TracksFilter/TracksFilter";
import TracksSort from "../components/TracksSort/TracksSort";
import TracksCounter from "../components/TracksCounter";
import { useTracksFilter } from "../components/TracksFilter/TracksFilterProvider";
import { useTracksSort } from "../components/TracksSort/TracksSortProvider";

export default function AllTracks() {
    const { filterTracks } = useTracksFilter();
    const { sortTracks } = useTracksSort();

    const sortedTracks = sortTracks(filterTracks());

    return (
        <>
            <Typography variant="h5">
                <TracksCounter tracks={sortedTracks} />
            </Typography>
            <Box display="flex">
                <TracksFilter />
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
