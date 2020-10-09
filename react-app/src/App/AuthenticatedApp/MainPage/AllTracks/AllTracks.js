import React, { useEffect } from "react";
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

export default function AllTracks() {
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();
    const { filterTracks } = useTracksFilter();
    const { sortTracks } = useTracksSort();
    const { searchTracks } = useTracksSearch();

    const sortedTracks = sortTracks(searchTracks(filterTracks()));

    useEffect(() => {
        updateLastVisitedAllTracksPage();
    });

    return (
        <>
            <TracksSummary tracks={sortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <TracksFilter />
                <TracksSearch />
                <Box flexGrow={1} />
                <TracksSort />
            </Box>
            <TracksList tracks={sortedTracks} />
        </>
    );
}
