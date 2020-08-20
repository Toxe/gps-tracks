import { countActivities, countYears } from "../TracksStats";

const tracks = [
    {
        activity_mode: 0,
        time_start: "2019-10-14T10:09:57",
    },
    {
        activity_mode: 0,
        time_start: "2020-11-03T10:09:57",
    },
    {
        activity_mode: 1,
        time_start: "2020-05-08T10:09:57",
    },
    {
        activity_mode: 1,
        time_start: "2019-05-08T10:09:57",
    },
    {
        activity_mode: 0,
        time_start: "2020-12-10T10:09:57",
    },
];

test("countActivities works", () => {
    const counted = countActivities(tracks);
    expect(counted.get(0)).toBe(3);
    expect(counted.get(1)).toBe(2);
});

test("countActivities returns null if there are no tracks", () => {
    expect(countActivities(null)).toBe(null);
    expect(countActivities([])).toBe(null);
});

test("countYears works", () => {
    const counted = countYears(tracks);
    expect(counted.get(2019)).toBe(2);
    expect(counted.get(2020)).toBe(3);
});

test("countYears returns null if there are no tracks", () => {
    expect(countYears(null)).toBe(null);
    expect(countYears([])).toBe(null);
});
