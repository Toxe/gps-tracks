import React from "react";
import { Box } from "@material-ui/core";
import Filter from "./Filter";
import Sort from "./Sort";
import { List } from "./List";
import { Search } from "./Search";
import { Summary } from "./Summary";
import { useAllTracks } from "./hooks";

export default function AllTracks() {
    const { filteredAndSortedTracks, tracksPerPage, searchText, handleUpdateSearchText } = useAllTracks();

    return (
        <>
            <Summary tracks={filteredAndSortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <Filter />
                <Search searchText={searchText} handleUpdateSearchText={handleUpdateSearchText} />
                <Box flexGrow={1} />
                <Sort />
            </Box>
            <List tracks={filteredAndSortedTracks} tracksPerPage={tracksPerPage} />
        </>
    );
}
