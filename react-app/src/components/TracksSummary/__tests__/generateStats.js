import "jest-extended";
import "expect-more-jest";
import { sampleTracks } from "../../../test/sampleTracks";
import { generateStats } from "../TracksSummary";
import { ActivityMode } from "../../../utils/enums";

describe("generateStats()", () => {
    describe("With good data", () => {
        it("Generates correct bike stats", () => {
            const stats_bike = generateStats(sampleTracks(), ActivityMode.BIKE);

            expect(stats_bike).not.toBeNull();
            expect(stats_bike).toBeObject();
            expect(stats_bike.activity).toBe(ActivityMode.BIKE);
            expect(stats_bike.count).toBe(3);
            expect(stats_bike.distance).toBeCloseTo(100948.13);
            expect(stats_bike.duration).toBeCloseTo(26170.46);
        });

        it("Generates correct hiking stats", () => {
            const stats_hiking = generateStats(sampleTracks(), ActivityMode.HIKING);

            expect(stats_hiking).not.toBeNull();
            expect(stats_hiking).toBeObject();
            expect(stats_hiking.activity).toBe(ActivityMode.HIKING);
            expect(stats_hiking.count).toBe(2);
            expect(stats_hiking.distance).toBeCloseTo(12339.49);
            expect(stats_hiking.duration).toBeCloseTo(12194.91);
        });
    });

    describe("With bad data", () => {
        test("When list is null, return null", () => {
            expect(generateStats(null)).toBeNull();
        });

        test("When list is undefined, return null", () => {
            expect(generateStats(undefined)).toBeNull();
        });

        test("When list is empty, return null", () => {
            expect(generateStats([])).toBeNull();
        });
    });
});
