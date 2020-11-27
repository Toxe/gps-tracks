import { useMemo } from "react";
import { useFiltering } from "../Filter";
import { useSearching } from "../Search";
import { useSorting } from "../Sort";

const tracksPerPage = 25;

export default function useContent(tracks) {
    const {
        activityFilter,
        yearFilter,
        availableActivities,
        availableYears,
        handleChangeActivityFilter,
        handleChangeYearFilter,
        filterTracks,
    } = useFiltering(tracks);
    const { searchText, handleUpdateSearchText, searchTracks } = useSearching();
    const { sortBy, sortOrder, handleChangeSortBy, handleFlipSortOrder, sortTracks } = useSorting();

    const filteredAndSortedTracks = useMemo(() => sortTracks(searchTracks(filterTracks())), [
        filterTracks,
        searchTracks,
        sortTracks,
    ]);

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
        handleChangeActivityFilter,
        handleChangeYearFilter,
        handleUpdateSearchText,
        handleChangeSortBy,
        handleFlipSortOrder,
    };
}
