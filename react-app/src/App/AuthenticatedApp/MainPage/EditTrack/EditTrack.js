import React from "react";
import { Track, TrackNotFound } from "../shared";
import EditTrackForm from "./EditTrackForm";
import { useEditTrack } from "./hooks";

export default function EditTrack({ navigateToSingleTrack }) {
    const { track, requestError, handleSave, handleCancel } = useEditTrack(navigateToSingleTrack);

    if (!track) {
        return <TrackNotFound />;
    }

    return (
        <div>
            <Track track={track} />
            <EditTrackForm track={track} handleSave={handleSave} handleCancel={handleCancel} />
            {requestError}
        </div>
    );
}
