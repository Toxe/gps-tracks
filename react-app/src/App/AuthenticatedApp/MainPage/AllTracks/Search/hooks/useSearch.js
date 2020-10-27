import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../../utils/urlSearchParams";

export default function useSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    const searchTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        const searchFor = searchText.toLowerCase();
        return tracks.filter((t) => t.title.toLowerCase().includes(searchFor));
    };

    const handleUpdateSearchText = (text) => {
        setOrRemoveDefaultSearchParam(searchParams, "search", text, "");
        setSearchParams(searchParams);
    };

    return { searchText, handleUpdateSearchText, searchTracks };
}
