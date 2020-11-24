import React from "react";
import { Track } from "../../shared";

export default React.memo(function TracksList({ tracks }) {
    if (!tracks || tracks.length === 0) {
        return null;
    }

    return (
        <div>
            {tracks.map((track) => (
                <Track key={track.id} track={track} />
            ))}
        </div>
    );
});
