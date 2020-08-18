import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksSearch } from "./TracksSearchProvider";
import SearchField from "./SearchField";

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function TracksSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchText, setSearchText } = useTracksSearch();

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    const updateSearch = (text) => {
        searchParams.set("search", text);
        setSearchParams(searchParams);
    };

    return <SearchField initialSearchText={searchText} updateSearch={updateSearch} />;
}
