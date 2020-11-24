import React from "react";
import { Drawer, Hidden } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const drawerWidth = 200;

const useStyles = makeStyles(() => ({
    drawerPaper: { width: drawerWidth },
}));

export default function MobileDrawer({ drawer, mobileNavigationOpen, handleMobileNavigationToggle }) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Hidden smUp implementation="css">
            <Drawer
                variant="temporary"
                classes={{ paper: classes.drawerPaper }}
                open={mobileNavigationOpen}
                onClose={handleMobileNavigationToggle}
                anchor={theme.direction === "rtl" ? "right" : "left"}
                ModalProps={{ keepMounted: true }}>
                {drawer}
            </Drawer>
        </Hidden>
    );
}
