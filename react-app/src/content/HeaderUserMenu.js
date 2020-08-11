import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Hidden, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useAuth } from "../Auth/AuthProvider";
import { useUser } from "../api/UserProvider";

const useStyles = makeStyles((theme) => ({
    userMenuButton: { marginRight: theme.spacing(2) },
}));

export default function HeaderUserMenu() {
    const classes = useStyles();
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const { logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

    const handleUserMenu = (e) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleUserMenuTracksClick = () => {
        handleUserMenuClose();
        navigate("/");
    };

    const handleUserMenuLogoutClick = async () => {
        handleUserMenuClose();
        await logout();
    };

    if (!user)
        return null;

    return (
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
                    {user.username}
                </Button>
            </Hidden>
            <Menu
                anchorEl={userMenuAnchorEl}
                keepMounted
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}>
                <MenuItem onClick={handleUserMenuTracksClick}>GPS Tracks</MenuItem>
                <MenuItem onClick={handleUserMenuLogoutClick}>Logout</MenuItem>
            </Menu>
        </>
    );
}
