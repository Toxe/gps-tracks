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
    const { sortBy, sortOrder, setSortBy, setSortOrder, getDefaultSortOrder } = useTracksSort();

    useEffect(() => {
        const sort = getSearchParam(searchParams, "s", "date");
        setSortBy(sort);
        setSortOrder(getSearchParam(searchParams, "so", getDefaultSortOrder(sort)));
    }, [searchParams, setSortBy, setSortOrder, getDefaultSortOrder]);

    const setOrRemoveDefaultSearchParam = (param, value, defaultValue) => {
        if (value === defaultValue)
            searchParams.delete(param);
        else
            searchParams.set(param, value);
    }

    const updateSortURLParams = (sort, order) => {
        setOrRemoveDefaultSearchParam("s", sort, "date");
        setOrRemoveDefaultSearchParam("so", order, getDefaultSortOrder(sort));
        setSearchParams(searchParams);
    }

    const handleChangeSortBy = (e) => {
        updateSortURLParams(e.target.value, getDefaultSortOrder(e.target.value));
    };

    const handleChangeSortOrder = () => {
        updateSortURLParams(sortBy, sortOrder === "asc" ? "desc" : "asc");
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
