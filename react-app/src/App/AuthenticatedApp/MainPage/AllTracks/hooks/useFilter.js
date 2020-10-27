import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParam } from "../utils/urlSearchParams";

export default function useFilter(tracks) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activityFilter, setActivityFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const availableActivities = listAvailableActivities(tracks);
    const availableYears = listAvailableYears(tracks);

    useEffect(() => {
        setYearFilter(getSearchParam(searchParams, "year", ""));
        setActivityFilter(getSearchParam(searchParams, "activity", ""));
    }, [searchParams, setYearFilter, setActivityFilter]);

    const filterTracks = () => {
        if (!tracks || tracks.length === 0) {
            return [];
        }

        let filteredTracks = tracks;

        if (activityFilter !== "" && activityFilter !== "all") {
            const mode = Number(activityFilter);
            filteredTracks = filteredTracks.filter((t) => t.activity_mode === mode);
        }

        if (yearFilter !== "" && yearFilter !== "all") {
            const year = Number(yearFilter);
            filteredTracks = filteredTracks.filter((t) => new Date(t.time_start).getFullYear() === year);
        }

        return filteredTracks;
    };

    const handleChangeFilter = (filter, event) => {
        searchParams.set(filter, event.target.value);
        setSearchParams(searchParams);
    };

    return { activityFilter, yearFilter, availableActivities, availableYears, handleChangeFilter, filterTracks };
}

function convertToStrings(list) {
    return list.map((v) => String(v));
}

function listAvailableActivities(tracks) {
    if (!tracks || tracks.length === 0) {
        return [];
    }

    return convertToStrings(Array.from(new Set(tracks.map((t) => t.activity_mode))).sort());
}

function listAvailableYears(tracks) {
    if (!tracks || tracks.length === 0) {
        return [];
    }

    return convertToStrings(
        Array.from(new Set(tracks.map((t) => new Date(t.time_start).getFullYear()))).sort((a, b) => b - a)
    );
}
