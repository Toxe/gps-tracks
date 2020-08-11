import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Button, Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

const drawerWidth = 240;

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
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleAllTracksClick = () => {
        navigate("/tracks");
    };

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button onClick={handleAllTracksClick}>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="253 Tracks" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2020 (53)" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2019 (17)" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2018 (86)" />
                </ListItem>
            </List>
            <Divider />
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
