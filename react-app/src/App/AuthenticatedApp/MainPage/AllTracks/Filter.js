import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select } from "@material-ui/core";
import { ActivityIcon } from "../shared";
import { ActivityMode } from "../utils/enums";
import { useFilter } from "./hooks";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 90,
        minHeight: 37,
    },
}));

export default function Filter() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { activityFilter, yearFilter, availableActivities, availableYears, handleChangeFilter } = useFilter();

    const createActivityMenuItem = (activity) => {
        return (
            <MenuItem key={activity} value={activity}>
                <ListItemIcon>
                    <ActivityIcon activity={activity} />
                </ListItemIcon>
                <ListItemText>
                    {t(Number(activity) === ActivityMode.BIKE ? "activity_bike" : "activity_hiking")}
                </ListItemText>
            </MenuItem>
        );
    };

    return (
        <Box>
            <FormControl className={classes.filterForm}>
                <InputLabel id="activity-filter-select-label">{t("filter_activity")}</InputLabel>
                <Select
                    className={classes.filterFormSelect}
                    labelId="activity-filter-select-label"
                    id="activity-filter-select"
                    value={
                        activityFilter === "all" || availableActivities.includes(activityFilter) ? activityFilter : ""
                    }
                    onChange={(e) => handleChangeFilter("activity", e)}>
                    <MenuItem value="all">{t("filter_all")}</MenuItem>
                    {availableActivities.map((activity) => createActivityMenuItem(activity))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="year-filter-select-label">{t("filter_year")}</InputLabel>
                <Select
                    className={classes.filterFormSelect}
                    labelId="year-filter-select-label"
                    id="year-filter-select"
                    value={yearFilter === "all" || availableYears.includes(yearFilter) ? yearFilter : ""}
                    onChange={(e) => handleChangeFilter("year", e)}>
                    <MenuItem value="all">{t("filter_all")}</MenuItem>
                    {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}