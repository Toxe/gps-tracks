import React from "react";
import { Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

export default function NavigationYearList({ countedYears, handleNavigationClick }) {
    const years = [...countedYears.keys()].sort((a, b) => b - a);

    return (
        <>
            <List dense>
                {years.map((y) => (
                    <ListItem key={y} button onClick={() => handleNavigationClick(`?year=${y}`)}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={y} />
                        <Chip size="small" label={countedYears.get(y)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
