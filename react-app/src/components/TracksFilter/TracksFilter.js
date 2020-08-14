import React, { useEffect } from "react";
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

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function TracksFilter() {
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        activityFilter,
        yearFilter,
        setActivityFilter,
        setYearFilter,
        availableActivities,
        availableYears,
    } = useTracksFilter();

    useEffect(() => {
        setYearFilter(getSearchParam(searchParams, "y", ""));
        setActivityFilter(getSearchParam(searchParams, "a", ""));
    }, [searchParams, setYearFilter, setActivityFilter]);

    const handleChangeFilter = (filter, event) => {
        searchParams.set(filter, event.target.value);
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
                    onChange={(e) => handleChangeFilter("a", e)}>
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
                    onChange={(e) => handleChangeFilter("y", e)}>
                    <MenuItem value="all">All</MenuItem>
                    {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}