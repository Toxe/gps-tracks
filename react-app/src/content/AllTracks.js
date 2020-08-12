import React from "react";
import { Box, Typography } from "@material-ui/core";
import ExampleTrack from "./ExampleTrack";
import TracksFilter from "./TracksFilter";
import TracksSort from "./TracksSort";

export default function AllTracks({ tracks }) {
    return (
        <>
            <Typography variant="h5">{`${tracks.length} Track(s)`}</Typography>
            <Box display="flex">
                <TracksFilter />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <Box mt={2}>
                <ExampleTrack id={1} activity="bike" />
                <ExampleTrack id={2} activity="bike" />
                <ExampleTrack id={3} activity="hiking" />
                <ExampleTrack id={4} activity="hiking" />
            </Box>
        </>
    );
}
