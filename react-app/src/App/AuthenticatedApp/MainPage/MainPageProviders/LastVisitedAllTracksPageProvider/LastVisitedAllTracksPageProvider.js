import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const LastVisitedAllTracksPageContext = React.createContext();

export function useLastVisitedAllTracksPage() {
    const context = useContext(LastVisitedAllTracksPageContext);

    if (!context) {
        throw new Error("useLastVisitedAllTracksPage must be used within a LastVisitedAllTracksPageProvider");
    }

    return context;
}

export function LastVisitedAllTracksPageProvider({ children }) {
    const [lastVisitedAllTracksPage, setLastVisitedAllTracksPage] = useState(null);
    const navigate = useNavigate();

    const updateLastVisitedAllTracksPage = () => {
        setLastVisitedAllTracksPage(window.location.pathname + window.location.search);
    };

    const returnToLastVisitedAllTracksPage = () => {
        navigate(lastVisitedAllTracksPage ? lastVisitedAllTracksPage : "/tracks");
    };

    return (
        <LastVisitedAllTracksPageContext.Provider
            value={{ updateLastVisitedAllTracksPage, returnToLastVisitedAllTracksPage }}>
            {children}
        </LastVisitedAllTracksPageContext.Provider>
    );
}
