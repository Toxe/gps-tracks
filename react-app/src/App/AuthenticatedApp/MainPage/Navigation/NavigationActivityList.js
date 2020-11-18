import React from "react";
import { Chip, Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import { ActivityIcon } from "../shared";

export default function NavigationActivityList({ countedActivities, handleNavigationClick }) {
    const activities = [...countedActivities.keys()].sort();

    return (
        <>
            <List dense>
                {activities.map((activity) => (
                    <ListItem key={activity} button onClick={() => handleNavigationClick({ activity })}>
                        <ListItemIcon>
                            <ActivityIcon activity={activity} />
                        </ListItemIcon>
                        <Chip size="small" label={countedActivities.get(activity)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
