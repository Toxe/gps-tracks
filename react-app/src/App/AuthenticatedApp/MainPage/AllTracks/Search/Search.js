import React from "react";
import SearchField from "./SearchField";

export default React.memo(function Search({ searchText, handleUpdateSearchText }) {
    return <SearchField initialSearchText={searchText} handleUpdateSearchText={handleUpdateSearchText} />;
});
