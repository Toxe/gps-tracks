import React from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, TextField, InputAdornment } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    spacer: { flexGrow: 1.0 },
    searchField: {
        marginLeft: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    userName: {
        marginRight: theme.spacing(3),
    },
}));

export default function App() {
    const classes = useStyles();

    return (
        <>
            <AppBar position="static">
                <Toolbar>
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
                    <div className={classes.spacer} />
                    <Typography className={classes.userName} noWrap>
                        Example User
                    </Typography>
                    <GitHubIcon></GitHubIcon>
                </Toolbar>
            </AppBar>
            Content
        </>
    );
}
