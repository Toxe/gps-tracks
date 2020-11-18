import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select } from "@material-ui/core";
import { ActivityIcon } from "../../shared";
import { ActivityMode } from "../../utils/enums";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 90,
    },
}));

export default function FilterActivity({ activityFilter, availableActivities, handleChangeActivityFilter }) {
    const { t } = useTranslation();
    const classes = useStyles();

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
        <FormControl className={classes.filterForm}>
            <InputLabel id="activity-filter-select-label">{t("filter_activity")}</InputLabel>
            <Select
                className={classes.filterFormSelect}
                labelId="activity-filter-select-label"
                id="activity-filter-select"
                value={activityFilter === "all" || availableActivities.includes(activityFilter) ? activityFilter : ""}
                onChange={(e) => handleChangeActivityFilter(e.target.value)}>
                <MenuItem value="all">{t("filter_all")}</MenuItem>
                {availableActivities.map((activity) => createActivityMenuItem(activity))}
            </Select>
        </FormControl>
    );
}
