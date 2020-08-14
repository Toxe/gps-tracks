import React from "react";
import { useNavigate } from "react-router-dom";
import { Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

export default function NavigationYearList({ countedYears }) {
    const navigate = useNavigate();
    const years = [...countedYears.keys()].sort((a, b) => b - a);

    const handleClick = (year) => {
        navigate(`/tracks?y=${year}`);
    };

    return (
        <>
            <List dense>
                {years.map((y) => (
                    <ListItem key={y} button onClick={() => handleClick(y)}>
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
