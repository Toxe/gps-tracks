import React from "react";
import { Box, Typography } from "@material-ui/core";
import Track from "./Track";
import TracksFilter from "./TracksFilter";
import TracksSort from "./TracksSort";
import { useTracks } from "../api/TracksProvider";
import TracksCounter from "../components/TracksCounter";

export default function AllTracks() {
    const { tracks } = useTracks();

    return (
        <>
            <Typography variant="h5"><TracksCounter tracks={tracks} /></Typography>
            <Box display="flex">
                <TracksFilter />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <Box mt={2}>
                {tracks.map((track) => (
                    <Track key={track.id} track={track} />
                ))}
            </Box>
        </>
    );
}
