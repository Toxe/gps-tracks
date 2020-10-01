import "jest-extended";
import "expect-more-jest";
import { sampleTracks } from "../../test/sampleTracks";
import { countActivities, countYears } from "../tracksStats";

describe("countActivities()", () => {
    describe("With good data", () => {
        it("Generates correct data", () => {
            const counted = countActivities(sampleTracks());

            expect(counted).not.toBeNull();
            expect(counted).not.toBeEmpty();
            expect(counted.get(0)).toBe(3);
            expect(counted.get(1)).toBe(2);
        });
    });

    describe("With faulty data", () => {
        test("When list is null, return null", () => {
            expect(countActivities(null)).toBeNull();
        });

        test("When list is undefined, return null", () => {
            expect(countActivities(undefined)).toBeNull();
        });

        test("When list is empty, return null", () => {
            expect(countActivities([])).toBeNull();
        });
    });
});

describe("countYears()", () => {
    describe("With good data", () => {
        it("Generates correct data", () => {
            const counted = countYears(sampleTracks());

            expect(counted).not.toBeNull();
            expect(counted).not.toBeEmpty();
            expect(counted.get(2017)).toBe(2);
            expect(counted.get(2018)).toBe(3);
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
