import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksSearch } from "../../MainPageProviders/TracksSearchProvider";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../utils/urlSearchParams";
import SearchField from "./SearchField";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchText, setSearchText } = useTracksSearch();

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    const updateSearch = (text) => {
        setOrRemoveDefaultSearchParam(searchParams, "search", text, "");
        setSearchParams(searchParams);
    };

    return <SearchField initialSearchText={searchText} updateSearch={updateSearch} />;
}