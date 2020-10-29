import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamYear() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [yearFilter, setYearFilter] = useState("");

    useEffect(() => {
        setYearFilter(getSearchParam(searchParams, "year", ""));
    }, [searchParams]);

    const handleChangeYearFilter = (value) => {
        searchParams.set("year", value);
        setSearchParams(searchParams);
    };

    return { yearFilter, handleChangeYearFilter };
}
