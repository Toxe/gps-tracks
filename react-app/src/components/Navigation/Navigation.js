import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Button, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ViewListIcon from '@material-ui/icons/ViewList';
import { useTracks } from "../../api/TracksProvider";
import NavigationYearList from "./NavigationYearList";
import NavigationActivityList from "./NavigationActivityList";
import TracksCounter from "../TracksCounter";
import { countActivities, countYears } from "../../utils/TracksStats";

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

export default function Navigation({ mobileNavigationOpen, handleMobileNavigationToggle }) {
    const { t } = useTranslation();
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

    const handleNavigationClick = (redirectURL) => {
        if (mobileNavigationOpen)
            handleMobileNavigationToggle();

        navigate(redirectURL);
    };

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button onClick={() => handleNavigationClick("/tracks")}>
                    <ListItemIcon>
                        <ViewListIcon />
                    </ListItemIcon>
                    <ListItemText primary={<TracksCounter tracks={tracks} />} />
                </ListItem>
            </List>
            <Divider />
            {countedYears && <NavigationYearList countedYears={countedYears} handleNavigationClick={handleNavigationClick} />}
            {countedActivities && <NavigationActivityList countedActivities={countedActivities} handleNavigationClick={handleNavigationClick} />}
            <Box mt={2} mx="auto">
                <Button variant="contained" color="primary">{t("nav_upload_button")}</Button>
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
