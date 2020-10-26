import React from "react";
import { useTranslation } from "react-i18next";
import { TableSortLabel, Tooltip } from "@material-ui/core";

export default function SortOrder({ sortOrder, handleChangeSortOrder }) {
    const { t } = useTranslation();

    return (
        <Tooltip title={t("sort_button_change_sort_order")}>
            <TableSortLabel active direction={sortOrder} onClick={handleChangeSortOrder} />
        </Tooltip>
    );
}
