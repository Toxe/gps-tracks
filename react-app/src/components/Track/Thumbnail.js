import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    thumbnail: {
        width: 128,
        height: 128,
        backgroundColor: "lightgrey",
    },
}));

export default function Thumbnail() {
    const classes = useStyles();

    return <div className={classes.thumbnail} />;
}
