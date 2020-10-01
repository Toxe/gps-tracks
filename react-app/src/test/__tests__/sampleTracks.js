import "jest-extended";
import "expect-more-jest";
import { sampleTracks, sampleTrack } from "../sampleTracks";

describe("sampleTracks()", () => {
    it("Returns list of track objects", () => {
        const tracks = sampleTracks();

        expect(tracks).toBeArray();
        expect(tracks).not.toBeEmptyArray();
    });
});

describe("sampleTrack()", () => {
    test("When called with id of existing track, return track object", () => {
        const track = sampleTrack(21);

        expect(track).toBeObject();
        expect(track.id).toBe(21);
    });

    test("When called with id of non-existing track, return null", () => {
        expect(sampleTrack(9999)).toBeNull();
    });

    test("When called with null, return null", () => {
        expect(sampleTrack(null)).toBeNull();
    });

    test("When called with undefined, return null", () => {
        expect(sampleTrack(undefined)).toBeNull();
    });

    test("When called with a non-numeric id, return null", () => {
        expect(sampleTrack("1")).toBeNull();
    });
});
