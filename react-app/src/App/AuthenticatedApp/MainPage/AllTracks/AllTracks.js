import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import TracksFilter from "./TracksFilter";
import TracksList from "./TracksList";
import TracksSearch from "../../../../components/TracksSearch/TracksSearch";
import TracksSort from "./TracksSort";
import TracksSummary from "../../../../components/TracksSummary/TracksSummary";
import { useTracksFilter } from "../TracksFilterProvider";
import { useTracksSort } from "../TracksSortProvider";
import { useTracksSearch } from "../TracksSearchProvider";
import { useLastVisitedAllTracksPage } from "../LastVisitedAllTracksPageProvider";

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
