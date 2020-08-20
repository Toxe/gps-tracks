import React from "react";
import { Box, Chip } from "@material-ui/core";
import ActivityIcon from "../Track/ActivityIcon";
import Distance from "../Track/Distance";
import Duration from "../Track/Duration";

export default function StatsRow({ stats }) {
    if (!stats) {
        return null;
    }

    return (
        <Box display="flex">
            <Chip size="small" label={stats.count} />
            <ActivityIcon activity={stats.activity} />
            <Distance distance={stats.distance} />
            <Duration duration={stats.duration} />
        </Box>
    );
}
