import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Distance from "../Track/Distance";
import Duration from "../Track/Duration";
import SpacerColumn from "./SpacerColumn";

const useStyles = makeStyles((theme) => ({
    bold: {
        fontWeight: "bold",
    },
    rightAlign: {
        textAlign: "right",
    },
    summaryBorder: {
        borderTop: "medium double black",
    },
}));

export default function TotalRow({ stats }) {
    const classes = useStyles();

    if (!stats)
        return null;

    const distance = [...stats.values()].reduce((sum, st) => sum + st.distance, 0.0);
    const duration = [...stats.values()].reduce((sum, st) => sum + st.duration, 0.0);

    return (
        <tr className={classes.tr}>
            <td></td>
            <SpacerColumn />
            <td></td>
            <SpacerColumn wide />
            <td className={`${classes.rightAlign} ${classes.summaryBorder}`}><Distance bold distance={distance} /></td>
            <SpacerColumn wide />
            <td className={classes.summaryBorder}><Duration bold duration={duration} /></td>
        </tr>
    );
}
