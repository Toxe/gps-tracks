import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

export default function PageContent({ children }) {
    const classes = useStyles();

    return (
        <Box flexGrow={1} p={3}>
            <div className={classes.toolbar} />
            {children}
        </Box>
    );
}
