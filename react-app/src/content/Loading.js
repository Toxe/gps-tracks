import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    center: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

export default function Loading() {
    const classes = useStyles();

    return (
        <div className={classes.center}>
            <CircularProgress />
        </div>
    );
}
