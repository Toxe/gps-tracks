import React from "react";
import { useNavigate } from "react-router-dom";
import { Chip, Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

export default function NavigationActivityList({ countedActivities }) {
    const navigate = useNavigate();
    const activities = [...countedActivities.keys()].sort();

    const handleClick = (activity) => {
        navigate(`/tracks?a=${activity}`);
    };

    return (
        <>
            <List dense>
                {activities.map((a) => (
                    <ListItem key={a} button onClick={() => handleClick(a)}>
                        <ListItemIcon>
                            {a === 0 ? <DirectionsBikeIcon /> : <DirectionsWalkIcon />}
                        </ListItemIcon>
                        <Chip size="small" label={countedActivities.get(a)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
