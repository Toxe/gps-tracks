import React from "react";
import SearchField from "./SearchField";

export default function Search({ searchText, handleUpdateSearchText }) {
    return <SearchField initialSearchText={searchText} handleUpdateSearchText={handleUpdateSearchText} />;
}
