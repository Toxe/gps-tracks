import React from "react";
import { Box } from "@material-ui/core";
import SortBy from "./SortBy";
import SortOrder from "./SortOrder";

export default function Sort({ sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder }) {
    return (
        <Box display="flex" alignItems="flex-end">
            <SortBy sortBy={sortBy} handleChangeSortBy={handleChangeSortBy} />
            <SortOrder sortOrder={sortOrder} handleChangeSortOrder={handleChangeSortOrder} />
        </Box>
    );
}
