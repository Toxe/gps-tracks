import React from "react";
import { Chip, Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { ActivityMode } from "../../utils/Enums";

export default function NavigationActivityList({ countedActivities, handleNavigationClick }) {
    const activities = [...countedActivities.keys()].sort();

    return (
        <>
            <List dense>
                {activities.map((a) => (
                    <ListItem key={a} button onClick={() => handleNavigationClick(`/tracks?activity=${a}`)}>
                        <ListItemIcon>
                            {a === ActivityMode.BIKE ? <DirectionsBikeIcon /> : <DirectionsWalkIcon />}
                        </ListItemIcon>
                        <Chip size="small" label={countedActivities.get(a)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
