import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Button, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ViewListIcon from '@material-ui/icons/ViewList';
import { useTracks } from "../../api/TracksProvider";
import NavigationYearList from "./NavigationYearList";
import NavigationActivityList from "./NavigationActivityList";
import TracksCounter from "../TracksCounter";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    drawerPaper: { width: drawerWidth },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
}));

function countYears(tracks) {
    if (!tracks || tracks.length === 0)
        return null;

    const map = new Map();

    tracks.forEach((t) => {
        const date = new Date(t.time_start);
        const year = date.getFullYear();
        const count = map.get(year);
        map.set(year, count === undefined ? 1 : count + 1);
    });

    return map;
}

function countActivities(tracks) {
    if (!tracks || tracks.length === 0)
        return null;

    const map = new Map();

    tracks.forEach((t) => {
        const activity = t.activity_mode;
        const count = map.get(activity);
        map.set(activity, count === undefined ? 1 : count + 1);
    });

    return map;
}

export default function Navigation({ mobileNavigationOpen, handleMobileNavigationToggle }) {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const { tracks } = useTracks();
    const [countedYears, setCountedYears] = useState(null);
    const [countedActivities, setCountedActivities] = useState(null);

    useEffect(() => {
        setCountedYears(countYears(tracks));
        setCountedActivities(countActivities(tracks));
    }, [tracks]);

    const handleAllTracksClick = () => {
        navigate("/tracks");
    };

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button onClick={handleAllTracksClick}>
                    <ListItemIcon>
                        <ViewListIcon />
                    </ListItemIcon>
                    <ListItemText primary={<TracksCounter tracks={tracks} />} />
                </ListItem>
            </List>
            <Divider />
            {countedYears && <NavigationYearList countedYears={countedYears} />}
            {countedActivities && <NavigationActivityList countedActivities={countedActivities} />}
            <Box mt={2} mx="auto">
                <Button variant="contained" color="primary">
                    Upload
                </Button>
            </Box>
        </>
    );

    return (
        <nav className={classes.drawer}>
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    classes={{ paper: classes.drawerPaper }}
                    open={mobileNavigationOpen}
                    onClose={handleMobileNavigationToggle}
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    ModalProps={{ keepMounted: true }}>
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer variant="permanent" open classes={{ paper: classes.drawerPaper }}>
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    );
}