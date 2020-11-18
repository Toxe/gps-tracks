import React from "react";
import { Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

export default function NavigationYearList({ countedYears, handleNavigationClick }) {
    const years = [...countedYears.keys()].sort((a, b) => b - a);

    return (
        <>
            <List dense>
                {years.map((year) => (
                    <ListItem key={year} button onClick={() => handleNavigationClick({ year })}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={year} />
                        <Chip size="small" label={countedYears.get(year)} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </>
    );
}
