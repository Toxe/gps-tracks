import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Hidden, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useAuth } from "../../Auth/AuthProvider";
import { useUser } from "../../api/UserProvider";

const useStyles = makeStyles((theme) => ({
    menuButton: { marginRight: theme.spacing(2) },
}));

export default function UserMenu() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const { logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

    const handleMenu = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleMenuTracksClick = () => {
        handleMenuClose();
        navigate("/");
    };

    const handleMenuLogoutClick = async () => {
        handleMenuClose();
        await logout();
        navigate("/");
    };

    if (!user)
        return null;

    return (
        <>
            <Hidden smUp implementation="css">
                <IconButton color="inherit" onClick={handleMenu} className={classes.menuButton}>
                    <AccountCircleIcon />
                </IconButton>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Button
                    color="inherit"
                    size="large"
                    className={classes.menuButton}
                    onClick={handleMenu}
                    startIcon={<AccountCircleIcon />}>
                    {user.username}
                </Button>
            </Hidden>
            <Menu anchorEl={menuAnchorEl} keepMounted open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuTracksClick}>GPS Tracks</MenuItem>
                <MenuItem onClick={handleMenuLogoutClick}>{t("user_menu_logout")}</MenuItem>
            </Menu>
        </>
    );
}
