import React from "react";
import { TracksFilterProvider } from "./TracksFilterProvider";
import { TracksSortProvider } from "./TracksSortProvider";
import { TracksSearchProvider } from "./TracksSearchProvider";
import { LastVisitedAllTracksPageProvider } from "./LastVisitedAllTracksPageProvider";

export default function MainPageProviders({ children }) {
    return (
        <TracksFilterProvider>
            <TracksSearchProvider>
                <TracksSortProvider>
                    <LastVisitedAllTracksPageProvider>{children}</LastVisitedAllTracksPageProvider>
                </TracksSortProvider>
            </TracksSearchProvider>
        </TracksFilterProvider>
    );
}
