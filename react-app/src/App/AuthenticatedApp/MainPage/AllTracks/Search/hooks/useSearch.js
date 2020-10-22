import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTracksSearch } from "../../../MainPageProviders/TracksSearchProvider";
import { getSearchParam, setOrRemoveDefaultSearchParam } from "../../utils/urlSearchParams";

export default function useSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchText, setSearchText } = useTracksSearch();

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    const updateSearch = (text) => {
        setOrRemoveDefaultSearchParam(searchParams, "search", text, "");
        setSearchParams(searchParams);
    };

    return { searchText, updateSearch };
}
