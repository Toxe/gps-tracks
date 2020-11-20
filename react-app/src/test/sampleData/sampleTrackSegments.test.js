import { sampleTrackSegments } from "./sampleTrackSegments";

describe("sampleTrackSegments()", () => {
    it("Returns list of track segments", () => {
        const trackSegments = sampleTrackSegments();

        expect(trackSegments).toBeArray();
        expect(trackSegments).not.toBeEmptyArray();
    });
});
