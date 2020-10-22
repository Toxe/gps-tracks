import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { ActivityMode } from "../../utils/enums";
import StatsRow from "./StatsRow";
import TotalRow from "./TotalRow";
import { useSummary } from "./hooks";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: 5,
        marginBottom: theme.spacing(3),
    },
}));

export default function Summary({ tracks }) {
    const classes = useStyles();
    const { stats } = useSummary(tracks);

    if (!stats || stats.size === 0) {
        return null;
    }

    return (
        <Paper elevation={2} className={classes.paper}>
            <table>
                <tbody>
                    <StatsRow stats={stats} activity={ActivityMode.BIKE} />
                    <StatsRow stats={stats} activity={ActivityMode.HIKING} />
                    {stats.size > 1 && <TotalRow stats={stats} />}
                </tbody>
            </table>
        </Paper>
    );
}
