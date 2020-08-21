import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    smallGap: {
        width: theme.spacing(1),
    },
    wideGap: {
        width: theme.spacing(3),
    },
}));

export default function SpacerColumn({ wide }) {
    const classes = useStyles();

    return <td className={wide ? classes.wideGap : classes.smallGap}></td>;
}
