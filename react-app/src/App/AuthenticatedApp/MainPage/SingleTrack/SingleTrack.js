import React from "react";
import { Box } from "@material-ui/core";
import { Track, TrackNotFound } from "../shared";
import DownloadTrackButton from "./DownloadTrackButton";
import TrackMap from "./TrackMap";
import TrackDetails from "./TrackDetails";
import EditTrackButton from "./EditTrackButton";
import DeleteTrackButton from "./DeleteTrackButton";
import { useSingleTrack } from "./hooks";

export default function SingleTrack() {
    const { track, requestError, handleDownloadTrack, handleDeleteTrack, handleEditTrack } = useSingleTrack();

    if (!track) {
        return <TrackNotFound />;
    }

    return (
        <div>
            <Track track={track} />
            <Box mb={4} display="flex" justifyContent="flex-end">
                <TrackDetails track={track} />
                <Box flexGrow={1} />
                <EditTrackButton handleEditTrack={handleEditTrack} />
                <DownloadTrackButton handleDownloadTrack={handleDownloadTrack} />
                <DeleteTrackButton handleDeleteTrack={handleDeleteTrack} />
            </Box>
            {requestError}
            <TrackMap track={track} />
        </div>
    );
}
