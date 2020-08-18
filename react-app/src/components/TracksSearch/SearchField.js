import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useTracksSearch } from "./TracksSearchProvider";
import debounce from "lodash/debounce";

const useStyles = makeStyles((theme) => ({
    searchField: {
        marginLeft: 50,
    },
}));

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function SearchField() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchText, setSearchText } = useTracksSearch();
    const [searchFieldContent, setSearchFieldContent] = useState("");

    // update URL search param after a short delay once the user stopped typing
    const debouncedUpdateSearch = useCallback(
        debounce((text) => {
            searchParams.set("search", text);
            setSearchParams(searchParams);
        }, 300),
        []
    );

    // initialize searchText from URL param
    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    // initialize textfield content from searchText
    useEffect(() => {
        setSearchFieldContent(searchText);
    }, [searchText]);

    const handleChangeSearch = (e) => {
        setSearchFieldContent(e.target.value);
        debouncedUpdateSearch(e.target.value);
    };

    return (
        <TextField
            variant="outlined"
            size="small"
            className={classes.searchField}
            placeholder={t("search_placeholder")}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            value={searchFieldContent}
            onChange={handleChangeSearch}
        />
    );
}
