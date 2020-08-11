import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, ListItemIcon, MenuItem, Select } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 80,
        minHeight: 37,
    },
}));

export default function TracksFilter() {
    const classes = useStyles();
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

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
                    <MenuItem value="bike">
                        <ListItemIcon>
                            <DirectionsBikeIcon fontSize="small" />
                        </ListItemIcon>
                    </MenuItem>
                    <MenuItem value="hiking">
                        <ListItemIcon>
                            <DirectionsWalkIcon fontSize="small" />
                        </ListItemIcon>
                    </MenuItem>
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
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2019">2019</MenuItem>
                    <MenuItem value="2018">2018</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
