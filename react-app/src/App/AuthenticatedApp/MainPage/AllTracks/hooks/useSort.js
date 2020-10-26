import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../utils/urlSearchParams";

const compareFunctions = {
    date: (a, b) => new Date(a.time_start) - new Date(b.time_start),
distance: (a, b) => a.length3d - b.length3d,
    name: (a, b) => a.title.localeCompare(b.title),
};

const defaultSortOrder = {
    date: "desc",
distance: "desc",
    name: "asc",
};

export default function useSort() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState(defaultSortOrder["date"]);

    useEffect(() => {
        const sort = getSearchParam(searchParams, "sort", "date");
        setSortBy(sort);
        setSortOrder(getSearchParam(searchParams, "order", defaultSortOrder[sort]));
    }, [searchParams, setSortBy, setSortOrder]);

    const sortTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        return [...tracks].sort(compare(sortBy, sortOrder));
    };

    const updateSortURLParams = (sort, order) => {
        setOrRemoveDefaultSearchParam(searchParams, "sort", sort, "date");
        setOrRemoveDefaultSearchParam(searchParams, "order", order, defaultSortOrder[sort]);
        setSearchParams(searchParams);
    };

    const handleChangeSortBy = (e) => {
        updateSortURLParams(e.target.value, defaultSortOrder[e.target.value]);
    };

    const handleChangeSortOrder = () => {
        updateSortURLParams(sortBy, sortOrder === "asc" ? "desc" : "asc");
    };

    return { sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder, sortTracks };
}

function compare(sortBy, sortOrder) {
    const cmp = compareFunctions[sortBy];

    return sortOrder === "asc" ? (a, b) => cmp(a, b) :
                                 (a, b) => cmp(b, a);
}
