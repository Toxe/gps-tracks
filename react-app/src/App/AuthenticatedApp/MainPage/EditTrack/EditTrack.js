import React from "react";
import { Track, TrackNotFound } from "../shared";
import EditTrackForm from "./EditTrackForm";
import { useEditTrack } from "./hooks";

export default function EditTrack() {
    const { track, requestError, handleSave, handleCancel } = useEditTrack();

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
