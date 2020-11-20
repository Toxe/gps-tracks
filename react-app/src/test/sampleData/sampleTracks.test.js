import { sampleTracks, sampleTrack } from "./sampleTracks";

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

    test("When called with id of non-existing track, return undefined", () => {
        expect(sampleTrack(9999)).toBeUndefined();
    });

    test("When called with null, return undefined", () => {
        expect(sampleTrack(null)).toBeUndefined();
    });

    test("When called with undefined, return undefined", () => {
        expect(sampleTrack(undefined)).toBeUndefined();
    });

    test("When called with a non-numeric id, return undefined", () => {
        expect(sampleTrack("1")).toBeUndefined();
    });
});
