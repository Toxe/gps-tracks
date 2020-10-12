import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { Tracks } from ".";
import { sampleUser, sampleTrack, sampleTrackSegments } from "../../../test";

jest.mock("axios");

describe("Tracks API", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("Update track data", () => {
        test("When called with valid arguments, return updated track data", async () => {
            const user = sampleUser(1);
            const newValues = { ...sampleTrack(21), title: "new title" };

            axiosMock.put.mockResolvedValueOnce({ status: 200, data: newValues });

            const track = await Tracks.update(user, 21, newValues);

            expect(track).toBeObject();
            expect(track.id).toBe(21);
            expect(track.title).toBe("new title");
        });
    });

    describe("Delete track", () => {
        test("When called with valid track, return response", async () => {
            axiosMock.delete.mockResolvedValueOnce({ status: 204 });

            const status = await Tracks.delete(sampleTrack(21));

            expect(status).toBe(204);
        });
    });

    describe("Download track gpx file", () => {
        test("When called with valid track, return gpx file as Blob object", async () => {
            axiosMock.get.mockResolvedValueOnce({
                status: 200,
                data: new Blob(["content"], { type: "application/gpx+xml" }),
            });

            const blob = await Tracks.download(sampleTrack(21));

            expect(blob).toBeInstanceOf(Blob);
        });
    });

    describe("Download track segments", () => {
        test("When called with valid track, return array of segments", async () => {
            axiosMock.get.mockResolvedValueOnce({ status: 200, data: sampleTrackSegments() });

            const segments = await Tracks.segments(sampleTrack(21));

            expect(segments).toBeArray();
        });
    });
});
