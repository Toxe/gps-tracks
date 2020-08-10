import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
    AppBar,
    Box,
    Button,
    Hidden,
    IconButton,
    InputAdornment,
    Link,
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
import { CurrentUserContext } from "./Auth/CurrentUserContext";

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

export default function MainHeader({ handleMobileNavigationToggle }) {
    const classes = useStyles();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const { currentUserId } = useContext(CurrentUserContext);

    const handleUserMenu = (e) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                {handleMobileNavigationToggle && (
                    <Hidden smUp implementation="css">
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleMobileNavigationToggle}
                            className={classes.menuButton}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                )}
                <Typography variant="h6" noWrap>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">GPS Tracks</Link>
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
                {currentUserId > 0 && (
                    <>
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
                                User #{currentUserId}
                            </Button>
                        </Hidden>
                    </>
                )}
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
    );
}
