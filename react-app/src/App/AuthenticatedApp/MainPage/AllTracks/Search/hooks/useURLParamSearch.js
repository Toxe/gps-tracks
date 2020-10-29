import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../../utils/urlSearchParams";

export default function useURLParamSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams]);

    const handleUpdateSearchText = (text) => {
        setOrRemoveDefaultSearchParam(searchParams, "search", text, "");
        setSearchParams(searchParams);
    };

    return { searchText, handleUpdateSearchText };
}
