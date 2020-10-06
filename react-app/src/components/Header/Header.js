import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, Hidden, IconButton, Link, Toolbar, Tooltip, Typography } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import { useAuth } from "../../Auth";
import UserMenu from "./UserMenu";
import LanguageSelection from "./LanguageSelection";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

export default function Header({ handleMobileNavigationToggle }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { authId } = useAuth();

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
                <Box flexGrow={1} />
                <LanguageSelection />
                {authId && <UserMenu />}
                <Link href="https://github.com/Toxe/gps-tracks" color="inherit" target="_blank" rel="noopener">
                    <Tooltip title={t("github_tooltip")}>
                        <GitHubIcon />
                    </Tooltip>
                </Link>
            </Toolbar>
        </AppBar>
    );
}
