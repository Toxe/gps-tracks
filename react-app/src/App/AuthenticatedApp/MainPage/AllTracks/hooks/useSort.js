import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksSort } from "../../MainPageProviders/TracksSortProvider";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../utils/urlSearchParams";

export default function useSort() {
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

    return { sortBy, sortOrder, handleChangeSortBy, handleChangeSortOrder };
}
