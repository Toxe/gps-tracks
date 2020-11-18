import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import { TracksCounter } from "../shared";
import NavigationYearList from "./NavigationYearList";
import NavigationActivityList from "./NavigationActivityList";
import { UploadTrackButton } from "./UploadTrackButton";
import { useNavigation } from "./hooks";

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

export default function Navigation({ mobileNavigationOpen, handleMobileNavigationToggle, navigateToAllTracks }) {
    const classes = useStyles();
    const theme = useTheme();
    const { numTracks, countedYears, countedActivities, handleNavigationClick } = useNavigation(
        mobileNavigationOpen,
        handleMobileNavigationToggle,
        navigateToAllTracks
    );

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button onClick={() => handleNavigationClick(null)}>
                    <ListItemIcon>
                        <ViewListIcon />
                    </ListItemIcon>
                    <ListItemText primary={<TracksCounter count={numTracks} />} />
                </ListItem>
            </List>
            <Divider />
            {countedYears && (
                <NavigationYearList countedYears={countedYears} handleNavigationClick={handleNavigationClick} />
            )}
            {countedActivities && (
                <NavigationActivityList
                    countedActivities={countedActivities}
                    handleNavigationClick={handleNavigationClick}
                />
            )}
            <Box mt={2} mx="auto">
                <UploadTrackButton />
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
