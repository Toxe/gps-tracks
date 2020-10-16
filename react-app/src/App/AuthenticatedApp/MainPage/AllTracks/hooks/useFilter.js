import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksFilter } from "../../MainPageProviders/TracksFilterProvider";
import { getSearchParam } from "../utils/urlSearchParams";

export default function useFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        activityFilter,
        yearFilter,
        setActivityFilter,
        setYearFilter,
        availableActivities,
        availableYears,
    } = useTracksFilter();

    useEffect(() => {
        setYearFilter(getSearchParam(searchParams, "year", ""));
        setActivityFilter(getSearchParam(searchParams, "activity", ""));
    }, [searchParams, setYearFilter, setActivityFilter]);

    const handleChangeFilter = (filter, event) => {
        searchParams.set(filter, event.target.value);
        setSearchParams(searchParams);
    };

    return { activityFilter, yearFilter, availableActivities, availableYears, handleChangeFilter };
}
