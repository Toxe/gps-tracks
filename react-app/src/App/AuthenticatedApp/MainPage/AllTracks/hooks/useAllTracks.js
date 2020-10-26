import { useEffect } from "react";
import { useTracksFilter } from "../../MainPageProviders/TracksFilterProvider";
import { useTracksSort } from "../../MainPageProviders/TracksSortProvider";
import { useTracksSearch } from "../../MainPageProviders/TracksSearchProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useFilter, useSearch, useSort } from ".";

const tracksPerPage = 25;

export default function useAllTracks() {
    const { activityFilter, yearFilter, availableActivities, availableYears, handleChangeFilter } = useFilter();
    const { searchText, handleUpdateSearchText } = useSearch();
    const { sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder } = useSort();
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();
    const { filterTracks } = useTracksFilter();
    const { sortTracks } = useTracksSort();
    const { searchTracks } = useTracksSearch();

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
