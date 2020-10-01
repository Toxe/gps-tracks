import "jest-extended";
import "expect-more-jest";
import { countYears } from "../tracksStats";

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

describe("countYears()", () => {
    describe("With good data", () => {
        it("Generates correct data", () => {
            const counted = countYears(tracks);

            expect(counted).not.toBeNull();
            expect(counted).not.toBeEmpty();
            expect(counted.get(2019)).toBe(2);
            expect(counted.get(2020)).toBe(3);
        });
    });

    describe("With faulty data", () => {
        test("When list is null, return null", () => {
            expect(countYears(null)).toBeNull();
        });

        test("When list is undefined, return null", () => {
            expect(countYears(undefined)).toBeNull();
        });

        test("When list is empty, return null", () => {
            expect(countYears([])).toBeNull();
        });
    });
});
