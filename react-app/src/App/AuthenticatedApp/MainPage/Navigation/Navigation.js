import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ViewListIcon from "@material-ui/icons/ViewList";
import { TracksCounter } from "../shared";
import NavigationYearList from "./NavigationYearList";
import NavigationActivityList from "./NavigationActivityList";
import { UploadTrackButton } from "./UploadTrackButton";
import { useNavigation } from "./hooks";
import MobileDrawer from "./MobileDrawer";
import DesktopDrawer from "./DesktopDrawer";

export const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
}));

export default function Navigation({ mobileNavigationOpen, handleMobileNavigationToggle, navigateToAllTracks }) {
    const classes = useStyles();
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
            <MobileDrawer
                drawer={drawer}
                mobileNavigationOpen={mobileNavigationOpen}
                handleMobileNavigationToggle={handleMobileNavigationToggle}
            />
            <DesktopDrawer drawer={drawer} />
        </nav>
    );
}
