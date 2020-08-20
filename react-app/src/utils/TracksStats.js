export function countYears(tracks) {
    if (!tracks || tracks.length === 0)
        return null;

    const map = new Map();

    tracks.forEach((t) => {
        const date = new Date(t.time_start);
        const year = date.getFullYear();
        const count = map.get(year);
        map.set(year, count === undefined ? 1 : count + 1);
    });

    return map;
}

export function countActivities(tracks) {
    if (!tracks || tracks.length === 0)
        return null;

    const map = new Map();

    tracks.forEach((t) => {
        const activity = t.activity_mode;
        const count = map.get(activity);
        map.set(activity, count === undefined ? 1 : count + 1);
    });

    return map;
}
