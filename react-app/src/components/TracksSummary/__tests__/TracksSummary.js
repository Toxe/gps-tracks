import { generateStats } from "../TracksSummary";
import { ActivityMode } from "../../../utils/Enums";

const tracks = [
    {
        activity_mode: 0,
        length3d: 100.0,
        moving_time: 10.0,
    },
    {
        activity_mode: 0,
        length3d: 100.0,
        moving_time: 10.0,
    },
    {
        activity_mode: 1,
        length3d: 100.0,
        moving_time: 10.0,
    },
    {
        activity_mode: 1,
        length3d: 100.0,
        moving_time: 10.0,
    },
    {
        activity_mode: 0,
        length3d: 100.0,
        moving_time: 10.0,
    },
];

test("generateStats works", () => {
    const stats_bike = generateStats(tracks, ActivityMode.BIKE);
    const stats_hiking = generateStats(tracks, ActivityMode.HIKING);

    expect(stats_bike).not.toBeNull();
    expect(stats_hiking).not.toBeNull();

    expect(stats_bike.activity).toBe(ActivityMode.BIKE);
    expect(stats_bike.count).toBe(3);
    expect(stats_bike.distance).toBe(300.0);
    expect(stats_bike.duration).toBe(30.0);

    expect(stats_hiking.activity).toBe(ActivityMode.HIKING);
    expect(stats_hiking.count).toBe(2);
    expect(stats_hiking.distance).toBe(200.0);
    expect(stats_hiking.duration).toBe(20.0);
});

test("generateStats returns null if there are no tracks", () => {
    expect(generateStats(null)).toBeNull();
    expect(generateStats([])).toBeNull();
});
