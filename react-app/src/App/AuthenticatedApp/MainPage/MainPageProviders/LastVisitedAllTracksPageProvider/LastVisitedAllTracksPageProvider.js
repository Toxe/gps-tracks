import React, { useState, useContext, useCallback, useMemo } from "react";

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
    const windowLocationSearch = useMemo(() => window.location.search, []);

    const updateLastVisitedAllTracksPage = useCallback(() => {
        setLastVisitedAllTracksPageFilterParams(windowLocationSearch);
    }, [windowLocationSearch]);

    const returnToLastVisitedAllTracksPage = useCallback(
        (navigateToAllTracks, trackDeleted) => {
            navigateToAllTracks(Object.fromEntries(new URLSearchParams(lastVisitedAllTracksPageFilterParams).entries()), trackDeleted);
        },
        [lastVisitedAllTracksPageFilterParams]
    );

    return (
        <LastVisitedAllTracksPageContext.Provider
            value={{ updateLastVisitedAllTracksPage, returnToLastVisitedAllTracksPage }}>
            {children}
        </LastVisitedAllTracksPageContext.Provider>
    );
}
