import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import MainHeader from "./MainHeader";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

export default function MainPage() {
    const classes = useStyles();

    return (
        <>
            <MainHeader />
            <Box flexGrow={1} p={3}>
                <div className={classes.toolbar} />
            </Box>
        </>
    );
}
