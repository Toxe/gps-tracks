import React, { useState } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
    AppBar,
    Box,
    Button,
    Hidden,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MainNavigation from "./MainNavigation";
import MainContent from "./MainContent";

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
}));

export default function App() {
    const classes = useStyles();
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

            <MainNavigation mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <MainContent />
        </>
    );
}
