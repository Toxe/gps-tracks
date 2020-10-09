import "jest-extended";
import "expect-more-jest";
import { sampleGPXFiles, sampleGPXFile } from "./sampleGPXFiles";

describe("sampleGPXFiles()", () => {
    it("Returns list of gpx file objects", () => {
        const gpxfiles = sampleGPXFiles();

        expect(gpxfiles).toBeArray();
        expect(gpxfiles).not.toBeEmptyArray();
    });
});

describe("sampleGPXFile()", () => {
    test("When called with id of existing file, return gpx file object", () => {
        const gpxfile = sampleGPXFile(21);

        expect(gpxfile).toBeObject();
        expect(gpxfile.id).toBe(21);
    });

    test("When called with id of non-existing file, return undefined", () => {
        expect(sampleGPXFile(9999)).toBeUndefined();
    });

    test("When called with null, return undefined", () => {
        expect(sampleGPXFile(null)).toBeUndefined();
    });

    test("When called with undefined, return undefined", () => {
        expect(sampleGPXFile(undefined)).toBeUndefined();
    });

    test("When called with a non-numeric id, return undefined", () => {
        expect(sampleGPXFile("1")).toBeUndefined();
    });
});
