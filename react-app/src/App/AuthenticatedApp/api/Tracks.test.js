import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { Tracks } from ".";
import { sampleTrack, sampleTrackSegments } from "../../../test";

jest.mock("axios");

describe("Tracks API", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("Update track data", () => {
        test("When called with valid arguments, return updated track data", async () => {
            const track = sampleTrack(21);
            const newValues = { ...track, title: "new title" };

            axiosMock.put.mockResolvedValueOnce({ status: 200, data: newValues });

            const updatedTrack = await Tracks.update(track, newValues);

            expect(updatedTrack).toBeObject();
            expect(updatedTrack.id).toBe(21);
            expect(updatedTrack.title).toBe("new title");
        });

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Tracks.update(null, null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Delete track", () => {
        test("When called with valid track, return response", async () => {
            axiosMock.delete.mockResolvedValueOnce({ status: 204 });

            const status = await Tracks.delete(sampleTrack(21));

            expect(status).toBe(204);
        });

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Tracks.delete(null)).rejects.toEqual(new TypeError("invalid arguments"));
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

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Tracks.download(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Download track segments", () => {
        test("When called with valid track, return array of segments", async () => {
            axiosMock.get.mockResolvedValueOnce({ status: 200, data: sampleTrackSegments() });

            const segments = await Tracks.segments(sampleTrack(21));

            expect(segments).toBeArray();
        });

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Tracks.segments(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });
});
