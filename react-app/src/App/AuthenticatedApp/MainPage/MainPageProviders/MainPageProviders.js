import React from "react";
import { LastVisitedAllTracksPageProvider } from "./LastVisitedAllTracksPageProvider";

export default function MainPageProviders({ children }) {
    return <LastVisitedAllTracksPageProvider>{children}</LastVisitedAllTracksPageProvider>;
}
