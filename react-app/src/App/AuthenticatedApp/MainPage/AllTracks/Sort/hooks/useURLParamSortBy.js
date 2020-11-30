import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamSortBy(updateSortByURLParam) {
    const [searchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        setSortBy(getSearchParam(searchParams, "sort", "date"));
    }, [searchParams]);

    const handleChangeSortBy = useCallback((value) => updateSortByURLParam(value), [updateSortByURLParam]);

    return { sortBy, handleChangeSortBy };
}
