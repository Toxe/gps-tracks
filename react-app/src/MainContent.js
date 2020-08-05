import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Paper,
    Select,
    TableSortLabel,
    Typography,
} from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
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
    track: {
        marginBottom: theme.spacing(2),
    },
    trackThumbnail: {
        width: 128,
        height: 128,
        backgroundColor: "lightgrey",
    },
}));

export default function MainContent() {
    const classes = useStyles();
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleChangeActivityFilter = (e) => {
        setActivityFilter(e.target.value);
    };

    const handleChangeYearFilter = (e) => {
        setYearFilter(e.target.value);
    };

    const handleChangeSortBy = (e) => {
        setSortBy(e.target.value);
        setSortOrder("asc");
    };

    const handleChangeSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const exampleTrack = (activity) => {
        return (
            <Paper square className={classes.track}>
                <Box display="flex">
                    <Box>
                        <div className={classes.trackThumbnail} />
                    </Box>
                    <Box flexGrow={1} m={1}>
                        <Typography variant="h6">{activity === "bike" ? "Bike Ride" : "Hiking"}</Typography>
                        <Grid container spacing={3}>
                            <Grid item>
                                {activity === "bike" && <DirectionsBikeIcon fontSize="small" />}
                                {activity === "hiking" && <DirectionsWalkIcon fontSize="small" />}
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">25 km</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">1:30 h</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">12 km/h</Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="body2" color="textSecondary">
                            25.07.2020
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        );
    };

    return (
        <Box flexGrow={1} p={3}>
            <div className={classes.toolbar} />
            <Typography variant="h5">253 Tracks</Typography>
            <Box display="flex">
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
                {exampleTrack("bike")}
                {exampleTrack("bike")}
                {exampleTrack("hiking")}
                {exampleTrack("hiking")}
            </Box>
        </Box>
    );
}
