import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ActivityIcon from "../Track/ActivityIcon";
import Distance from "../Track/Distance";
import Duration from "../Track/Duration";
import TracksCounter from "../TracksCounter";
import SpacerColumn from "./SpacerColumn";

const useStyles = makeStyles((theme) => ({
    bold: {
        fontWeight: "bold",
    },
    rightAlign: {
        textAlign: "right",
    },
}));

export default function StatsRow({ stats, activity }) {
    const classes = useStyles();
    const activityStats = stats.get(activity);

    if (!activityStats || activityStats.count === 0)
        return null;

    return (
        <tr>
            <td><ActivityIcon activity={activityStats.activity} /></td>
            <SpacerColumn />
            <td className={classes.rightAlign}><Typography variant="body1" className={stats.size === 1 ? classes.bold : null}><TracksCounter count={activityStats.count} /></Typography></td>
            <SpacerColumn wide />
            <td className={classes.rightAlign}><Distance distance={activityStats.distance} /></td>
            <SpacerColumn wide />
            <td><Duration duration={activityStats.duration} /></td>
        </tr>
    );
}
