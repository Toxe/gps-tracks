import { useCallback } from "react";
import { useURLParamSearch } from ".";

export default function useSearching() {
    const { searchText, handleUpdateSearchText } = useURLParamSearch();

    const searchTracks = useCallback(
        (tracks) => {
            if (!tracks || tracks.length === 0) {
                return [];
            }

            if (searchText === "") {
                return tracks;
            }

            const searchFor = searchText.toLowerCase();
            return tracks.filter((t) => t.title.toLowerCase().includes(searchFor));
        },
        [searchText]
    );

    return { searchText, handleUpdateSearchText, searchTracks };
}
