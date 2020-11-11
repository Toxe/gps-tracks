import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Hidden, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useUserMenu } from "./hooks";

const useStyles = makeStyles((theme) => ({
    menuButton: { marginRight: theme.spacing(2) },
}));

export default function UserMenu() {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
        user,
        menuAnchorEl,
        handleMenu,
        handleMenuClose,
        handleMenuTracksClick,
        handleMenuLogoutClick,
    } = useUserMenu();

    if (!user) {
        return null;
    }

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
