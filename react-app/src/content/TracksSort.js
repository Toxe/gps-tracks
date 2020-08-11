import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, TableSortLabel } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    sortForm: {
        minWidth: 100,
        marginRight: theme.spacing(1),
    },
}));

export default function TracksSort() {
    const classes = useStyles();
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleChangeSortBy = (e) => {
        setSortBy(e.target.value);
        setSortOrder("asc");
    };

    const handleChangeSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <Box display="flex" alignItems="flex-end">
            <FormControl className={classes.sortForm}>
                <InputLabel id="sort-by-select-label">Sort by</InputLabel>
                <Select
                    labelId="sort-by-select-label"
                    id="sort-by-select"
                    value={sortBy}
                    autoWidth
                    onChange={handleChangeSortBy}>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                </Select>
            </FormControl>
            <TableSortLabel active direction={sortOrder} onClick={handleChangeSortOrder} />
        </Box>
    );
}
