import React, { useState } from "react";
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    FormControl,
    Hidden,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Select,
    TableSortLabel,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import FolderIcon from "@material-ui/icons/Folder";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    searchField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    userMenuButton: { marginRight: theme.spacing(2) },
    drawerPaper: { width: drawerWidth },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 80,
        minHeight: 37,
    },
    sortForm: {
        minWidth: 100,
        marginRight: theme.spacing(1),
    },
}));

export default function App() {
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleUserMenu = (e) => {
        setUserMenuAnchorEl(e.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleChangeActivityFilter = (e) => {
        setActivityFilter(e.target.value);
    };

    const handleChangeYearFilter = (e) => {
        setYearFilter(e.target.value);
    };

    const handleChangeSortBy = (e) => {
        setSortBy(e.target.value);
        setSortOrder("asc");
    };

    const handleChangeSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const drawer = (
        <>
            <div className={classes.toolbar} />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="253 Tracks" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2020 (53)" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2019 (17)" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="2018 (86)" />
                </ListItem>
            </List>
            <Divider />
            <Box mt={2} mx="auto">
                <Button variant="contained" color="primary">
                    Upload
                </Button>
            </Box>
        </>
    );

    return (
        <>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Hidden smUp implementation="css">
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography variant="h6" noWrap>
                        GPS Tracks
                    </Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        className={classes.searchField}
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box flexGrow={1} />
                    <Hidden smUp implementation="css">
                        <IconButton color="inherit" onClick={handleUserMenu} className={classes.userMenuButton}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Button
                            color="inherit"
                            size="large"
                            className={classes.userMenuButton}
                            onClick={handleUserMenu}
                            startIcon={<AccountCircleIcon />}>
                            Example User
                        </Button>
                    </Hidden>
                    <Menu
                        anchorEl={userMenuAnchorEl}
                        keepMounted
                        open={Boolean(userMenuAnchorEl)}
                        onClose={handleUserMenuClose}>
                        <MenuItem onClick={handleUserMenuClose}>GPS Tracks</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
                    </Menu>
                    <GitHubIcon />
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        classes={{ paper: classes.drawerPaper }}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        ModalProps={{ keepMounted: true }}>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer variant="permanent" open classes={{ paper: classes.drawerPaper }}>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <Box flexGrow={1} p={3}>
                <div className={classes.toolbar} />
                <Typography variant="h5">253 Tracks</Typography>
                <Box display="flex">
                    <Box>
                        <FormControl className={classes.filterForm}>
                            <InputLabel id="activity-filter-select-label">Activity</InputLabel>
                            <Select
                                className={classes.filterFormSelect}
                                labelId="activity-filter-select-label"
                                id="activity-filter-select"
                                value={activityFilter}
                                onChange={handleChangeActivityFilter}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="bike">
                                    <ListItemIcon>
                                        <DirectionsBikeIcon fontSize="small" />
                                    </ListItemIcon>
                                </MenuItem>
                                <MenuItem value="hiking">
                                    <ListItemIcon>
                                        <DirectionsWalkIcon fontSize="small" />
                                    </ListItemIcon>
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="year-filter-select-label">Year</InputLabel>
                            <Select
                                className={classes.filterFormSelect}
                                labelId="year-filter-select-label"
                                id="year-filter-select"
                                value={yearFilter}
                                onChange={handleChangeYearFilter}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="2020">2020</MenuItem>
                                <MenuItem value="2019">2019</MenuItem>
                                <MenuItem value="2018">2018</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box flexGrow={1} />
                    <Box display="flex" alignItems="flex-end">
                        <FormControl className={classes.sortForm}>
                            <InputLabel id="sort-by-select-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-by-select-label"
                                id="sort-by-select"
                                value={sortBy}
                                autoWidth
                                onChange={handleChangeSortBy}>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="distance">Distance</MenuItem>
                            </Select>
                        </FormControl>
                        <TableSortLabel active direction={sortOrder} onClick={handleChangeSortOrder} />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
