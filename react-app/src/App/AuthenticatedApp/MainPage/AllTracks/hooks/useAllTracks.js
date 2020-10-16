import { useEffect } from "react";
import { useTracksFilter } from "../../MainPageProviders/TracksFilterProvider";
import { useTracksSort } from "../../MainPageProviders/TracksSortProvider";
import { useTracksSearch } from "../../MainPageProviders/TracksSearchProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";

export default function useAllTracks() {
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();
    const { filterTracks } = useTracksFilter();
    const { sortTracks } = useTracksSort();
    const { searchTracks } = useTracksSearch();

    const filteredAndSortedTracks = sortTracks(searchTracks(filterTracks()));

    useEffect(() => {
        updateLastVisitedAllTracksPage();
    });

    return { filteredAndSortedTracks };
}
