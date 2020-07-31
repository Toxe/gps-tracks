import React, { useState } from "react";
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    InputAdornment,
    Hidden,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Box,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import SearchIcon from "@material-ui/icons/Search";
import FolderIcon from "@material-ui/icons/Folder";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    searchField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    userMenuButton: { marginRight: theme.spacing(2) },
    drawerPaper: { width: drawerWidth },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
}));

export default function App() {
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleUserMenu = (e) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button>
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
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Hidden smUp implementation="css">
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography variant="h6" noWrap>
                        GPS Tracks
                    </Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        className={classes.searchField}
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box flexGrow={1} />
                    <Hidden smUp implementation="css">
                        <IconButton color="inherit" onClick={handleUserMenu} className={classes.userMenuButton}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Button
                            color="inherit"
                            size="large"
                            className={classes.userMenuButton}
                            onClick={handleUserMenu}
                            startIcon={<AccountCircleIcon />}>
                            Example User
                        </Button>
                    </Hidden>
                    <Menu
                        anchorEl={userMenuAnchorEl}
                        keepMounted
                        open={Boolean(userMenuAnchorEl)}
                        onClose={handleUserMenuClose}>
                        <MenuItem onClick={handleUserMenuClose}>GPS Tracks</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
                    </Menu>
                    <GitHubIcon />
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        classes={{ paper: classes.drawerPaper }}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
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
            <Box flexGrow={1} p={3}>
                <div className={classes.toolbar} />
                <Typography paragraph>Content.</Typography>
            </Box>
        </>
    );
}
