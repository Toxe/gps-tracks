import "jest-extended";
import "expect-more-jest";
import { sampleTracks } from "../../test/sampleTracks";
import { countActivities, countYears } from "../tracksStats";

describe("countActivities()", () => {
    describe("With good data", () => {
        it("Generates correct data", () => {
            const counted = countActivities(sampleTracks());

            expect(counted).not.toBeUndefined();
            expect(counted).not.toBeEmpty();
            expect(counted.get(0)).toBe(3);
            expect(counted.get(1)).toBe(2);
        });
    });

    describe("With faulty data", () => {
        test("When list is null, return undefined", () => {
            expect(countActivities(null)).toBeUndefined();
        });

        test("When list is undefined, return undefined", () => {
            expect(countActivities(undefined)).toBeUndefined();
        });

        test("When list is empty, return undefined", () => {
            expect(countActivities([])).toBeUndefined();
        });
    });
});

describe("countYears()", () => {
    describe("With good data", () => {
        it("Generates correct data", () => {
            const counted = countYears(sampleTracks());

            expect(counted).not.toBeUndefined();
            expect(counted).not.toBeEmpty();
            expect(counted.get(2017)).toBe(2);
            expect(counted.get(2018)).toBe(3);
        });
    });

    describe("With faulty data", () => {
        test("When list is null, return undefined", () => {
            expect(countYears(null)).toBeUndefined();
        });

        test("When list is undefined, return undefined", () => {
            expect(countYears(undefined)).toBeUndefined();
        });

        test("When list is empty, return undefined", () => {
            expect(countYears([])).toBeUndefined();
        });
    });
});
