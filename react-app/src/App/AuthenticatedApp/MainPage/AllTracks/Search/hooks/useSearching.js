import { useURLParamSearch } from ".";

export default function useSearching() {
    const { searchText, handleUpdateSearchText } = useURLParamSearch();

    const searchTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        if (searchText === "") {
            return tracks;
        }

        const searchFor = searchText.toLowerCase();
        return tracks.filter((t) => t.title.toLowerCase().includes(searchFor));
    };

    return { searchText, handleUpdateSearchText, searchTracks };
}
