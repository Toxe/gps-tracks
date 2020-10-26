import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, TableSortLabel, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    sortForm: {
        minWidth: 110,
        marginRight: theme.spacing(1),
    },
}));

export default function Sort({ sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Box display="flex" alignItems="flex-end">
            <FormControl className={classes.sortForm}>
                <InputLabel id="sort-by-select-label">{t("sort_by")}</InputLabel>
                <Select
                    labelId="sort-by-select-label"
                    id="sort-by-select"
                    value={sortBy}
                    autoWidth
                    onChange={handleChangeSortBy}>
                    <MenuItem value="date">{t("sort_by_date")}</MenuItem>
                    <MenuItem value="name">{t("sort_by_name")}</MenuItem>
                    <MenuItem value="distance">{t("sort_by_distance")}</MenuItem>
                </Select>
            </FormControl>
            <Tooltip title={t("sort_button_change_sort_order")}>
                <TableSortLabel active direction={sortOrder} onClick={handleChangeSortOrder} />
            </Tooltip>
        </Box>
    );
}
