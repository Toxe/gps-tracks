import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, TableSortLabel, Typography } from "@material-ui/core";
import ExampleTrack from "./ExampleTrack";
import TracksFilter from "./TracksFilter";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 80,
        minHeight: 37,
    },
    sortForm: {
        minWidth: 100,
        marginRight: theme.spacing(1),
    },
}));

export default function AllTracks() {
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
        <>
            <Typography variant="h5">253 Tracks</Typography>
            <Box display="flex">
                <TracksFilter />
                <Box flexGrow={1} />
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
            </Box>
            <Box mt={2}>
                <ExampleTrack id={1} activity="bike" />
                <ExampleTrack id={2} activity="bike" />
                <ExampleTrack id={3} activity="hiking" />
                <ExampleTrack id={4} activity="hiking" />
            </Box>
        </>
    );
}
