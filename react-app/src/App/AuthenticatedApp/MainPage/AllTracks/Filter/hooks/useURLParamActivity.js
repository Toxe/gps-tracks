import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamActivity() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activityFilter, setActivityFilter] = useState("");

    useEffect(() => {
        setActivityFilter(getSearchParam(searchParams, "activity", ""));
    }, [searchParams]);

    const handleChangeActivityFilter = (value) => {
        searchParams.set("activity", value);
        setSearchParams(searchParams);
    };

    return { activityFilter, handleChangeActivityFilter };
}
