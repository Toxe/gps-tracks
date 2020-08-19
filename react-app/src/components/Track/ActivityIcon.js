import React from "react";
import { ActivityMode } from "../../utils/Enums";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

export default function ActivityIcon({ activity }) {
    return (
        <>
            {activity === ActivityMode.BIKE && <DirectionsBikeIcon fontSize="small" />}
            {activity === ActivityMode.HIKING && <DirectionsWalkIcon fontSize="small" />}
        </>
    );
}
