import React, { useState, useContext } from "react";

const LastVisitedAllTracksPageContext = React.createContext();

export function useLastVisitedAllTracksPage() {
    const context = useContext(LastVisitedAllTracksPageContext);

    if (!context) {
        throw new Error("useLastVisitedAllTracksPage must be used within a LastVisitedAllTracksPageProvider");
    }

    return context;
}

export function LastVisitedAllTracksPageProvider({ children }) {
    const [lastVisitedAllTracksPageFilterParams, setLastVisitedAllTracksPageFilterParams] = useState("");

    const updateLastVisitedAllTracksPage = () => {
        setLastVisitedAllTracksPageFilterParams(window.location.search);
    };

    const returnToLastVisitedAllTracksPage = (navigateToAllTracks) => {
        navigateToAllTracks(Object.fromEntries(new URLSearchParams(lastVisitedAllTracksPageFilterParams).entries()));
    };

    return (
        <LastVisitedAllTracksPageContext.Provider
            value={{ updateLastVisitedAllTracksPage, returnToLastVisitedAllTracksPage }}>
            {children}
        </LastVisitedAllTracksPageContext.Provider>
    );
}
