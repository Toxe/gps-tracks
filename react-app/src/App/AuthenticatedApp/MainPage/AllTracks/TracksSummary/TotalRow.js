import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Distance, Duration } from "../../../../../components/Track";
import TracksCounter from "../../../../../components/TracksCounter";
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

    const count = [...stats.values()].reduce((sum, st) => sum + st.count, 0);
    const distance = [...stats.values()].reduce((sum, st) => sum + st.distance, 0.0);
    const duration = [...stats.values()].reduce((sum, st) => sum + st.duration, 0.0);

    return (
        <tr className={classes.tr}>
            <td></td>
            <SpacerColumn />
            <td className={`${classes.rightAlign} ${classes.summaryBorder}`}><Typography variant="body1" className={classes.bold}><TracksCounter count={count} /></Typography></td>
            <SpacerColumn wide />
            <td className={`${classes.rightAlign} ${classes.summaryBorder}`}><Distance bold distance={distance} /></td>
            <SpacerColumn wide />
            <td className={classes.summaryBorder}><Duration bold duration={duration} /></td>
        </tr>
    );
}
