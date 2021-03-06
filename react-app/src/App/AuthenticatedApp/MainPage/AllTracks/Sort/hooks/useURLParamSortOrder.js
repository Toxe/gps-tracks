import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamSortOrder(updateSortOrderURLParam, defaultSortOrder) {
    const [searchParams] = useSearchParams();
    const [sortOrder, setSortOrder] = useState(defaultSortOrder["date"]);

    useEffect(() => {
        const sortBy = getSearchParam(searchParams, "sort", "date");
        setSortOrder(getSearchParam(searchParams, "order", defaultSortOrder[sortBy]));
    }, [searchParams, defaultSortOrder]);

    const handleFlipSortOrder = useCallback(() => {
        updateSortOrderURLParam(sortOrder === "asc" ? "desc" : "asc");
    }, [sortOrder, updateSortOrderURLParam]);

    return { sortOrder, handleFlipSortOrder };
}
