import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { ActivityMode } from "../../utils/Enums";
import { useTracksFilter } from "./TracksFilterProvider";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 80,
        minHeight: 37,
    },
}));

function listAvailableActivities(tracks) {
    if (!tracks || tracks.length === 0)
        return [];

    return Array.from(new Set(tracks.map((t) => t.activity_mode))).sort();
}

function listAvailableYears(tracks) {
    if (!tracks || tracks.length === 0)
        return [];

    return Array.from(new Set(tracks.map((t) => new Date(t.time_start).getFullYear()))).sort((a, b) => b - a);
}

function convertToStrings(list) {
    return list.map((v) => String(v));
}

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function TracksFilter({ tracks }) {
    const classes = useStyles();
    const { activityFilter, yearFilter, setActivityFilter, setYearFilter } = useTracksFilter();
    const [availableActivities, setAvailableActivities] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setAvailableActivities(convertToStrings(listAvailableActivities(tracks)));
        setAvailableYears(convertToStrings(listAvailableYears(tracks)));

        setYearFilter(getSearchParam(searchParams, "y", ""));
        setActivityFilter(getSearchParam(searchParams, "a", ""));
    }, [tracks, searchParams, setYearFilter, setActivityFilter]);

    const handleChangeActivityFilter = (e) => {
        searchParams.set("a", e.target.value);
        setSearchParams(searchParams);
    };

    const handleChangeYearFilter = (e) => {
        searchParams.set("y", e.target.value);
        setSearchParams(searchParams);
    };

    return (
        <Box>
            <FormControl className={classes.filterForm}>
                <InputLabel id="activity-filter-select-label">Activity</InputLabel>
                <Select
                    className={classes.filterFormSelect}
                    labelId="activity-filter-select-label"
                    id="activity-filter-select"
                    value={activityFilter === "all" || availableActivities.includes(activityFilter) ? activityFilter : ""}
                    onChange={handleChangeActivityFilter}>
                    <MenuItem value="all">All</MenuItem>
                    {availableActivities.includes(String(ActivityMode.BIKE)) && (
                        <MenuItem value={ActivityMode.BIKE}>
                            <ListItemIcon>
                                <DirectionsBikeIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                    )}
                    {availableActivities.includes(String(ActivityMode.HIKING)) && (
                        <MenuItem value={ActivityMode.HIKING}>
                            <ListItemIcon>
                                <DirectionsWalkIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="year-filter-select-label">Year</InputLabel>
                <Select
                    className={classes.filterFormSelect}
                    labelId="year-filter-select-label"
                    id="year-filter-select"
                    value={yearFilter === "all" || availableYears.includes(yearFilter) ? yearFilter : ""}
                    onChange={handleChangeYearFilter}>
                    <MenuItem value="all">All</MenuItem>
                    {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
