import { useMemo } from "react";
import { useFiltering } from "../Filter";
import { useSearching } from "../Search";
import { useSorting } from "../Sort";

const tracksPerPage = 25;

export default function useContent(tracks) {
    const {
        activityFilter,
        yearFilter,
        listAvailableActivities,
        listAvailableYears,
        handleChangeActivityFilter,
        handleChangeYearFilter,
        filterTracks,
    } = useFiltering();
    const { searchText, handleUpdateSearchText, searchTracks } = useSearching();
    const { sortBy, sortOrder, handleChangeSortBy, handleFlipSortOrder, sortTracks } = useSorting();

    const availableActivities = useMemo(() => listAvailableActivities(tracks), [tracks, listAvailableActivities]);
    const availableYears = useMemo(() => listAvailableYears(tracks), [tracks, listAvailableYears]);

    const filteredAndSortedTracks = useMemo(() => sortTracks(searchTracks(filterTracks(tracks))), [
        tracks,
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
