import React from "react";
import { Drawer, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "./Navigation";

const useStyles = makeStyles(() => ({
    drawerPaper: { width: drawerWidth },
}));

export default React.memo(function DesktopDrawer({ drawer }) {
    const classes = useStyles();

    return (
        <Hidden xsDown implementation="css">
            <Drawer variant="permanent" open classes={{ paper: classes.drawerPaper }}>
                {drawer}
            </Drawer>
        </Hidden>
    );
});
