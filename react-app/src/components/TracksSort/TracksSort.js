import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, TableSortLabel } from "@material-ui/core";
import { useTracksSort } from "./TracksSortProvider";

const useStyles = makeStyles((theme) => ({
    sortForm: {
        minWidth: 100,
        marginRight: theme.spacing(1),
    },
}));

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function TracksSort() {
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const { sortBy, sortOrder, setSortBy, setSortOrder } = useTracksSort();

    useEffect(() => {
        setSortBy(getSearchParam(searchParams, "s", "date"));
        setSortOrder(getSearchParam(searchParams, "so", "desc"));
    }, [searchParams, setSortBy, setSortOrder]);

    const handleChangeSortBy = (e) => {
        searchParams.set("s", e.target.value);
        searchParams.set("so", "desc");
        setSearchParams(searchParams);
    };

    const handleChangeSortOrder = () => {
        searchParams.set("so", sortOrder === "asc" ? "desc" : "asc");
        setSearchParams(searchParams);
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
