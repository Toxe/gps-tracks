import React from "react";
import SearchField from "./SearchField";
import { useSearch } from "./hooks";

export default function Search() {
    const { searchText, updateSearch } = useSearch();

    return <SearchField initialSearchText={searchText} updateSearch={updateSearch} />;
}
