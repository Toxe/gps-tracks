import React, { useState, useContext } from "react";

const TracksSearchContext = React.createContext();

export function useTracksSearch() {
    const context = useContext(TracksSearchContext);

    if (!context)
        throw new Error("useTracksSearch must be used within a TracksSearchProvider");

    return context;
}

export function TracksSearchProvider(props) {
    const [searchText, setSearchText] = useState("");

    const searchTracks = (tracks) => {
        if (!tracks || tracks.length === 0)
            return [];

        const searchFor = searchText.toLowerCase();
        return tracks.filter((t) => t.title.toLowerCase().includes(searchFor));
    };

    return (
        <TracksSearchContext.Provider value={{ searchText, setSearchText, searchTracks }}>
            {props.children}
        </TracksSearchContext.Provider>
    );
}
