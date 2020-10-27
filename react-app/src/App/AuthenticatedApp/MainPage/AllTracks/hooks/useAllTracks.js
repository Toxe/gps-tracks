import { useEffect } from "react";
import { useTracks } from "../../../TracksProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useFilter, useSearch, useSort } from ".";

const tracksPerPage = 25;

export default function useAllTracks() {
    const { tracks } = useTracks();
    const {
        activityFilter,
        yearFilter,
        availableActivities,
        availableYears,
        handleChangeFilter,
        filterTracks,
    } = useFilter(tracks);
    const { searchText, handleUpdateSearchText, searchTracks } = useSearch();
    const { sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder, sortTracks } = useSort();
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();

    const filteredAndSortedTracks = sortTracks(searchTracks(filterTracks()));

    useEffect(() => {
        updateLastVisitedAllTracksPage();
    });

    return {
        filteredAndSortedTracks,
        tracksPerPage,
        activityFilter,
        yearFilter,
        searchText,
        sortBy,
        sortOrder,
        availableActivities,
        availableYears,
        handleChangeFilter,
        handleUpdateSearchText,
        handleChangeSortBy,
        handleChangeSortOrder,
    };
}
