import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    requestError: {
        color: "white",
        background: "red",
        padding: theme.spacing(1),
        margin: theme.spacing(2),
    },
}));

export default function RequestError({ error, handleClose }) {
    const classes = useStyles();

    return (
        <Paper className={classes.requestError}>
            <Typography variant="body1">Request error: {error.message}</Typography>
            {error.response && <Typography variant="body2">Server response: {error.response.status} {error.response.data.error}</Typography>}
            {error.response && error.response.data.message && <Typography variant="body2">{JSON.stringify(error.response.data.message, null, "  ")}</Typography>}
            <div>
                <button type="button" onClick={handleClose}>dismiss</button>
            </div>
        </Paper>
    );
}
