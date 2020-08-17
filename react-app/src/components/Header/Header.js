import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
    AppBar,
    Box,
    Hidden,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { useAuth } from "../../Auth/AuthProvider";
import UserMenu from "./UserMenu";
import LanguageSelection from "./LanguageSelection";

const useStyles = makeStyles((theme) => ({
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
                <TextField
                    variant="outlined"
                    size="small"
                    className={classes.searchField}
                    placeholder={t("search_placeholder")}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
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
