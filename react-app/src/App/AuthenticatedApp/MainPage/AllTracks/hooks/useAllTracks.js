import { useEffect } from "react";
import { useTracksFilter } from "../../MainPageProviders/TracksFilterProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useFilter, useSearch, useSort } from ".";

const tracksPerPage = 25;

export default function useAllTracks() {
    const { activityFilter, yearFilter, availableActivities, availableYears, handleChangeFilter } = useFilter();
    const { searchText, handleUpdateSearchText, searchTracks } = useSearch();
    const { sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder, sortTracks } = useSort();
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();
    const { filterTracks } = useTracksFilter();

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
