import { useURLParamSearch } from ".";

export default function useSearch() {
    const { searchText, handleUpdateSearchText } = useURLParamSearch();

    const searchTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        const searchFor = searchText.toLowerCase();
        return tracks.filter((t) => t.title.toLowerCase().includes(searchFor));
    };

    return { searchText, handleUpdateSearchText, searchTracks };
}
