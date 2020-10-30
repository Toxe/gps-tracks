import { useURLParamActivity, useURLParamYear } from ".";

export default function useFiltering(tracks) {
    const { activityFilter, handleChangeActivityFilter } = useURLParamActivity();
    const { yearFilter, handleChangeYearFilter } = useURLParamYear();
    const availableActivities = listAvailableActivities(tracks);
    const availableYears = listAvailableYears(tracks);

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

    return {
        activityFilter,
        yearFilter,
        availableActivities,
        availableYears,
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
