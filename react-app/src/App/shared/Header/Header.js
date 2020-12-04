import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, Hidden, IconButton, Link, Toolbar, Tooltip, Typography } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import UserMenu from "./UserMenu";
import { LanguageSelection } from "./LanguageSelection";
import { useHeader } from "./hooks";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

export default React.memo(function Header({ handleMobileNavigationToggle, navigateToRoot }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { authId } = useHeader();

    const userMenu = useMemo(() => (authId ? <UserMenu navigateToRoot={navigateToRoot} /> : null), [
        authId,
        navigateToRoot,
    ]);

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
                {userMenu}
                <Link href="https://github.com/Toxe/gps-tracks" color="inherit" target="_blank" rel="noopener">
                    <Tooltip title={t("github_tooltip")}>
                        <GitHubIcon />
                    </Tooltip>
                </Link>
            </Toolbar>
        </AppBar>
    );
});
