import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, TableSortLabel, Tooltip } from "@material-ui/core";
import { useTracksSort } from "../MainPageProviders/TracksSortProvider";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "./utils/urlSearchParams";

const useStyles = makeStyles((theme) => ({
    sortForm: {
        minWidth: 110,
        marginRight: theme.spacing(1),
    },
}));

export default function TracksSort() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const { sortBy, sortOrder, setSortBy, setSortOrder, getDefaultSortOrder } = useTracksSort();

    useEffect(() => {
        const sort = getSearchParam(searchParams, "sort", "date");
        setSortBy(sort);
        setSortOrder(getSearchParam(searchParams, "order", getDefaultSortOrder(sort)));
    }, [searchParams, setSortBy, setSortOrder, getDefaultSortOrder]);

    const updateSortURLParams = (sort, order) => {
        setOrRemoveDefaultSearchParam(searchParams, "sort", sort, "date");
        setOrRemoveDefaultSearchParam(searchParams, "order", order, getDefaultSortOrder(sort));
        setSearchParams(searchParams);
    };

    const handleChangeSortBy = (e) => {
        updateSortURLParams(e.target.value, getDefaultSortOrder(e.target.value));
    };

    const handleChangeSortOrder = () => {
        updateSortURLParams(sortBy, sortOrder === "asc" ? "desc" : "asc");
    };

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
