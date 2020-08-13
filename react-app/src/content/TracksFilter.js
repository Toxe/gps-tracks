import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { ActivityMode } from "../utils/Enums";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 80,
        minHeight: 37,
    },
}));

function listActivities(tracks) {
    if (!tracks || tracks.length === 0)
        return [];

    return Array.from(new Set(tracks.map((t) => t.activity_mode))).sort();
}

function listYears(tracks) {
    if (!tracks || tracks.length === 0)
        return [];

    return Array.from(new Set(tracks.map((t) => new Date(t.time_start).getFullYear()))).sort((a, b) => b - a);
}

export default function TracksFilter({ tracks, activityFilter, yearFilter, setActivityFilter, setYearFilter }) {
    const classes = useStyles();
    const [availableActivities, setAvailableActivities] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        setAvailableActivities(listActivities(tracks));
        setAvailableYears(listYears(tracks));
    }, [tracks]);

    const handleChangeActivityFilter = (e) => {
        setActivityFilter(e.target.value);
    };

    const handleChangeYearFilter = (e) => {
        setYearFilter(e.target.value);
    };

    return (
        <Box>
            <FormControl className={classes.filterForm}>
                <InputLabel id="activity-filter-select-label">Activity</InputLabel>
                <Select
                    className={classes.filterFormSelect}
                    labelId="activity-filter-select-label"
                    id="activity-filter-select"
                    value={activityFilter}
                    onChange={handleChangeActivityFilter}>
                    <MenuItem value="all">All</MenuItem>
                    {availableActivities.includes(ActivityMode.BIKE) && (
                        <MenuItem value={ActivityMode.BIKE}>
                            <ListItemIcon>
                                <DirectionsBikeIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                    )}
                    {availableActivities.includes(ActivityMode.HIKING) && (
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
                    value={yearFilter}
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
