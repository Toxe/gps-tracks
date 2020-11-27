import React from "react";
import { Box } from "@material-ui/core";
import { List } from "./List";
import { Summary } from "./Summary";
import { Filter } from "./Filter";
import { Search } from "./Search";
import { Sort } from "./Sort";
import { useContent } from "./hooks";

export default function Content({ tracks }) {
    const {
        filteredAndSortedTracks,
        tracksPerPage,
        activityFilter,
        yearFilter,
        searchText,
        sortBy,
        sortOrder,
        availableActivities,
        availableYears,
        handleChangeActivityFilter,
        handleChangeYearFilter,
        handleUpdateSearchText,
        handleChangeSortBy,
        handleFlipSortOrder,
    } = useContent(tracks);

    return (
        <>
            <Summary tracks={filteredAndSortedTracks} />
            <Box display="flex" alignItems="flex-end">
                <Filter
                    activityFilter={activityFilter}
                    yearFilter={yearFilter}
                    availableActivities={availableActivities}
                    availableYears={availableYears}
                    handleChangeActivityFilter={handleChangeActivityFilter}
                    handleChangeYearFilter={handleChangeYearFilter}
                />
                <Search searchText={searchText} handleUpdateSearchText={handleUpdateSearchText} />
                <Box flexGrow={1} />
                <Sort
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    handleChangeSortBy={handleChangeSortBy}
                    handleFlipSortOrder={handleFlipSortOrder}
                />
            </Box>
            <List tracks={filteredAndSortedTracks} tracksPerPage={tracksPerPage} />
        </>
    );
}
