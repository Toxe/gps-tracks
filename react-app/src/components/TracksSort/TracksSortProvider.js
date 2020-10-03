import React, { useState, useContext } from "react";

const compareFunctions = {
        date: (a, b) => new Date(a.time_start) - new Date(b.time_start),
    distance: (a, b) => a.length3d - b.length3d,
        name: (a, b) => a.title.localeCompare(b.title),
};

const defaultSortOrder = {
        date: "desc",
    distance: "desc",
        name: "asc",
};

const TracksSortContext = React.createContext();

export function useTracksSort() {
    const context = useContext(TracksSortContext);

    if (!context) {
        throw new Error("useTracksSort must be used within a TracksSortProvider");
    }

    return context;
}

export function TracksSortProvider({ children }) {
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState(defaultSortOrder["date"]);

    const sortTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        return [...tracks].sort(compare(sortBy, sortOrder));
    };

    const getDefaultSortOrder = (sort) => {
        return defaultSortOrder[sort];
    };

    return (
        <TracksSortContext.Provider
            value={{ sortBy, sortOrder, setSortBy, setSortOrder, sortTracks, getDefaultSortOrder }}>
            {children}
        </TracksSortContext.Provider>
    );
}

function compare(sortBy, sortOrder) {
    const cmp = compareFunctions[sortBy];

    return sortOrder === "asc" ? (a, b) => cmp(a, b) :
                                 (a, b) => cmp(b, a);
}
