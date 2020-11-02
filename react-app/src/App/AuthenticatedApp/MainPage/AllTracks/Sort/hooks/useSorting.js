import { useSearchParams } from "react-router-dom";
import { setOrRemoveDefaultSearchParam } from "../../utils/urlSearchParams";
import { useURLParamSortBy, useURLParamSortOrder } from ".";

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

export default function useSorting() {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateSortByURLParam = (newSortBy) => {
        setOrRemoveDefaultSearchParam(searchParams, "sort", newSortBy, "date");
        setOrRemoveDefaultSearchParam(searchParams, "order", defaultSortOrder[newSortBy], defaultSortOrder[newSortBy]);
        setSearchParams(searchParams);
    };

    const updateSortOrderURLParam = (newSortOrder) => {
        setOrRemoveDefaultSearchParam(searchParams, "sort", sortBy, "date");
        setOrRemoveDefaultSearchParam(searchParams, "order", newSortOrder, defaultSortOrder[sortBy]);
        setSearchParams(searchParams);
    };

    const { sortBy, handleChangeSortBy } = useURLParamSortBy(updateSortByURLParam);
    const { sortOrder, handleFlipSortOrder } = useURLParamSortOrder(updateSortOrderURLParam, defaultSortOrder);

    const sortTracks = (tracks) => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        return [...tracks].sort(compare(sortBy, sortOrder));
    };

    return { sortBy, sortOrder, handleChangeSortBy, handleFlipSortOrder, sortTracks };
}

function compare(sortBy, sortOrder) {
    const cmp = compareFunctions[sortBy];

    return sortOrder === "asc" ? (a, b) => cmp(a, b) :
                                 (a, b) => cmp(b, a);
}
