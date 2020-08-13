import React, { useState, useContext } from "react";

const TracksFilterContext = React.createContext();

export function TracksFilterProvider(props) {
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    const filterTracks = (tracks) => {
        if (!tracks || tracks.length === 0)
            return [];

        let filteredTracks = tracks;

        if (activityFilter !== "" && activityFilter !== "all") {
            const mode = parseInt(activityFilter);
            filteredTracks = filteredTracks.filter((t) => t.activity_mode === mode);
        }

        if (yearFilter !== "" && yearFilter !== "all") {
            const year = parseInt(yearFilter);
            filteredTracks = filteredTracks.filter((t) => new Date(t.time_start).getFullYear() === year);
        }

        return filteredTracks;
    };

    return (
        <TracksFilterContext.Provider
            value={{ activityFilter, yearFilter, setActivityFilter, setYearFilter, filterTracks }}>
            {props.children}
        </TracksFilterContext.Provider>
    );
}

export function useTracksFilter() {
    const context = useContext(TracksFilterContext);

    if (!context)
        throw new Error("useTracksFilter must be used within a TracksFilterProvider");

    return context;
}
