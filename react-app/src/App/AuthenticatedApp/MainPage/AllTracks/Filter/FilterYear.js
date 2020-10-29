import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    filterForm: {
        marginRight: theme.spacing(3),
    },
    filterFormSelect: {
        minWidth: 90,
        minHeight: 37,
    },
}));

export default function FilterYear({ yearFilter, availableYears, handleChangeYearFilter }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <FormControl>
            <InputLabel id="year-filter-select-label">{t("filter_year")}</InputLabel>
            <Select
                className={classes.filterFormSelect}
                labelId="year-filter-select-label"
                id="year-filter-select"
                value={yearFilter === "all" || availableYears.includes(yearFilter) ? yearFilter : ""}
                onChange={(e) => handleChangeYearFilter(e.target.value)}>
                <MenuItem value="all">{t("filter_all")}</MenuItem>
                {availableYears.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
