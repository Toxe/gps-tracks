import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(() => ({
    button: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
}));

export default function ClearSearchButton({ disabled, handleClick }) {
    const classes = useStyles();

    return (
        <IconButton disabled={disabled} disableRipple className={classes.button} onClick={handleClick}>
            <ClearIcon color={disabled ? "disabled" : "action"} fontSize="small" />
        </IconButton>
    );
}
