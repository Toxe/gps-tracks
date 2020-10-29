import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    sortForm: {
        minWidth: 110,
        marginRight: theme.spacing(1),
    },
}));

export default function SortBy({ sortBy, handleChangeSortBy }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <FormControl className={classes.sortForm}>
            <InputLabel id="sort-by-select-label">{t("sort_by")}</InputLabel>
            <Select
                labelId="sort-by-select-label"
                id="sort-by-select"
                value={sortBy}
                autoWidth
                onChange={(event) => handleChangeSortBy(event.target.value)}>
                <MenuItem value="date">{t("sort_by_date")}</MenuItem>
                <MenuItem value="name">{t("sort_by_name")}</MenuItem>
                <MenuItem value="distance">{t("sort_by_distance")}</MenuItem>
            </Select>
        </FormControl>
    );
}
