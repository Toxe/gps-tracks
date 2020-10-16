import React from "react";
import { Box } from "@material-ui/core";
import { useTracksFilter } from "../MainPageProviders/TracksFilterProvider";
import { useTracksSort } from "../MainPageProviders/TracksSortProvider";
import { useTracksSearch } from "../MainPageProviders/TracksSearchProvider";
import { useLastVisitedAllTracksPage } from "../MainPageProviders/LastVisitedAllTracksPageProvider";
import TracksFilter from "./TracksFilter";
import TracksList from "./TracksList";
import TracksSort from "./TracksSort";
import { TracksSearch } from "./TracksSearch";
import { TracksSummary } from "./TracksSummary";
import { useAllTracks } from "./hooks";

export default function AllTracks() {
    const { filteredAndSortedTracks } = useAllTracks();

    return (
        <>
            <TracksSummary tracks={filteredAndSortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <Filter />
                <TracksSearch />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <TracksList tracks={filteredAndSortedTracks} />
        </>
    );
}
