import React from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

export default function NavigationYearList({ countedYears }) {
    const years = [...countedYears.keys()].sort((a, b) => b - a);

    return (
        <>
            <List>
                {years.map((y) => (
                    <ListItem key={y} button>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={`${y} (${countedYears.get(y)})`} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
