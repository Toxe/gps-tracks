import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ActivityIcon from "../Track/ActivityIcon";
import Distance from "../Track/Distance";
import Duration from "../Track/Duration";
import TracksCounter from "../TracksCounter";

const useStyles = makeStyles((theme) => ({
    smallGap: {
        paddingLeft: theme.spacing(1),
    },
    wideGap: {
        paddingLeft: theme.spacing(4),
    },
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
            <td className={`${classes.rightAlign} ${classes.smallGap}`}><Typography variant="body1"><TracksCounter count={stats.count} /></Typography></td>
            <td className={`${classes.rightAlign} ${classes.wideGap}`}><Distance distance={stats.distance} /></td>
            <td className={classes.wideGap}><Duration duration={stats.duration} /></td>
        </tr>
    );
}
