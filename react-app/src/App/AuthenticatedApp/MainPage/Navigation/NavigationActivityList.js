import React from "react";
import { Chip, Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import { ActivityIcon } from "../../../../components/Track";

export default function NavigationActivityList({ countedActivities, handleNavigationClick }) {
    const activities = [...countedActivities.keys()].sort();

    return (
        <>
            <List dense>
                {activities.map((a) => (
                    <ListItem key={a} button onClick={() => handleNavigationClick(`/tracks?activity=${a}`)}>
                        <ListItemIcon>
                            <ActivityIcon activity={a} />
                        </ListItemIcon>
                        <Chip size="small" label={countedActivities.get(a)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
