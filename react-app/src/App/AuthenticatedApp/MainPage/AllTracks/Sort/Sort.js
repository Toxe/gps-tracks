import React from "react";
import { Box } from "@material-ui/core";
import SortBy from "./SortBy";
import SortOrder from "./SortOrder";

export default React.memo(function Sort({ sortBy, sortOrder, handleChangeSortBy, handleFlipSortOrder }) {
    return (
        <Box display="flex" alignItems="flex-end">
            <SortBy sortBy={sortBy} handleChangeSortBy={handleChangeSortBy} />
            <SortOrder sortOrder={sortOrder} handleFlipSortOrder={handleFlipSortOrder} />
        </Box>
    );
});
