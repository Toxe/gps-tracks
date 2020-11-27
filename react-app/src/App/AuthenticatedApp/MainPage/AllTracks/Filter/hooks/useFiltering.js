import { useCallback } from "react";
import { useURLParamActivity, useURLParamYear } from ".";

export default function useFiltering() {
    const { activityFilter, handleChangeActivityFilter } = useURLParamActivity();
    const { yearFilter, handleChangeYearFilter } = useURLParamYear();

    const filterTracks = useCallback(
        (tracks) => {
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
        },
        [activityFilter, yearFilter]
    );

    return {
        activityFilter,
        yearFilter,
        listAvailableActivities,
        listAvailableYears,
        handleChangeActivityFilter,
        handleChangeYearFilter,
        filterTracks,
    };
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
