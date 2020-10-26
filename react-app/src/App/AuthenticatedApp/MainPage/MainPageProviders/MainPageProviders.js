import React from "react";
import { TracksFilterProvider } from "./TracksFilterProvider";
import { LastVisitedAllTracksPageProvider } from "./LastVisitedAllTracksPageProvider";

export default function MainPageProviders({ children }) {
    return (
        <TracksFilterProvider>
            <LastVisitedAllTracksPageProvider>{children}</LastVisitedAllTracksPageProvider>
        </TracksFilterProvider>
    );
}
