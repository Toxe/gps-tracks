import { useEffect } from "react";
import { useTracks } from "../../../TracksProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useFiltering } from "../Filter";
import { useSearching } from "../Search";
import { useSorting } from "../Sort";

const tracksPerPage = 25;

export default function useAllTracks() {
    const { tracks } = useTracks();
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
        handleChangeActivityFilter,
        handleChangeYearFilter,
        handleUpdateSearchText,
        handleChangeSortBy,
        handleFlipSortOrder,
    };
}
