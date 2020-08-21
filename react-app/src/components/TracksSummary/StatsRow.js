import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ActivityIcon from "../Track/ActivityIcon";
import Distance from "../Track/Distance";
import Duration from "../Track/Duration";
import TracksCounter from "../TracksCounter";
import SpacerColumn from "./SpacerColumn";

const useStyles = makeStyles((theme) => ({
    rightAlign: {
        textAlign: "right",
    },
}));

export default function StatsRow({ stats }) {
    const classes = useStyles();

    if (!stats)
        return null;

    return (
        <tr>
            <td><ActivityIcon activity={stats.activity} /></td>
            <SpacerColumn />
            <td className={classes.rightAlign}><Typography variant="body1"><TracksCounter count={stats.count} /></Typography></td>
            <SpacerColumn wide />
            <td className={classes.rightAlign}><Distance distance={stats.distance} /></td>
            <SpacerColumn wide />
            <td><Duration duration={stats.duration} /></td>
        </tr>
    );
}
