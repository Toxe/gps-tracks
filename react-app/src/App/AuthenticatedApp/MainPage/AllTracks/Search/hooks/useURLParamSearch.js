import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams]);

    const handleUpdateSearchText = useCallback((text) => {
        setOrRemoveDefaultSearchParam(searchParams, "search", text, "");
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    return { searchText, handleUpdateSearchText };
}
