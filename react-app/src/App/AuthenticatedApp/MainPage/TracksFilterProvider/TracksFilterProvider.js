import React, { useState, useContext, useEffect } from "react";
import { useTracks } from "../../TracksProvider";

const TracksFilterContext = React.createContext();

export function useTracksFilter() {
    const context = useContext(TracksFilterContext);

    if (!context) {
        throw new Error("useTracksFilter must be used within a TracksFilterProvider");
    }

    return context;
}

export function TracksFilterProvider({ children }) {
    const { tracks } = useTracks();
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [availableActivities, setAvailableActivities] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        setAvailableActivities(listAvailableActivities(tracks));
        setAvailableYears(listAvailableYears(tracks));
    }, [tracks]);

    const filterTracks = () => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        let filteredTracks = tracks;

        if (activityFilter !== "" && activityFilter !== "all") {
            const mode = Number(activityFilter);
            filteredTracks = filteredTracks.filter((t) => t.activity_mode === mode);
        }

        if (yearFilter !== "" && yearFilter !== "all") {
            const year = Number(yearFilter);
            filteredTracks = filteredTracks.filter((t) => new Date(t.time_start).getFullYear() === year);
        }

        return filteredTracks;
    };

    return (
        <TracksFilterContext.Provider
            value={{
                activityFilter,
                yearFilter,
                setActivityFilter,
                setYearFilter,
                filterTracks,
                availableActivities,
                availableYears,
            }}>
            {children}
        </TracksFilterContext.Provider>
    );
}

function convertToStrings(list) {
    return list.map((v) => String(v));
}

function listAvailableActivities(tracks) {
    if (!tracks || tracks.length === 0) {
        return [];
    }

    return convertToStrings(Array.from(new Set(tracks.map((t) => t.activity_mode))).sort());
}

function listAvailableYears(tracks) {
    if (!tracks || tracks.length === 0) {
        return [];
    }

    return convertToStrings(
        Array.from(new Set(tracks.map((t) => new Date(t.time_start).getFullYear()))).sort((a, b) => b - a)
    );
}
