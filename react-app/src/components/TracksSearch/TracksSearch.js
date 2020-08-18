import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksSearch } from "./TracksSearchProvider";
import SearchField from "./SearchField";
import { getSearchParam } from "../../utils/URLParams";

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
