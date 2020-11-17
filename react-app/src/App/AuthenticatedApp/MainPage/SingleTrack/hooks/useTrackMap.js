import { useState, useEffect } from "react";
import { latLngBounds } from "leaflet";
import { Tracks } from "../../../api";

export default function useTrackMap(track) {
    const [segments, setSegments] = useState(null);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        async function loadSegments(track) {
            const segments = await Tracks.segments(track);
            setSegments(segments);
            setBounds(latLngBounds(segments));
        }

        if (track) {
            loadSegments(track);
        }
    }, [track]);

    return { segments, bounds };
}
