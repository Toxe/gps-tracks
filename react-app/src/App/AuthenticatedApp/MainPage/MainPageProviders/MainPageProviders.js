import React from "react";
import { TracksFilterProvider } from "./TracksFilterProvider";
import { TracksSortProvider } from "./TracksSortProvider";
import { LastVisitedAllTracksPageProvider } from "./LastVisitedAllTracksPageProvider";

export default function MainPageProviders({ children }) {
    return (
        <TracksFilterProvider>
            <TracksSortProvider>
                <LastVisitedAllTracksPageProvider>{children}</LastVisitedAllTracksPageProvider>
            </TracksSortProvider>
        </TracksFilterProvider>
    );
}
