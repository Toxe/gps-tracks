import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { sampleGPXFile, sampleTrack, sampleTracks, sampleUser } from "../../../test";
import { GPXFiles, Tracks, Users } from "../api";
import { useUser } from "../UserProvider";
import { TracksProvider, useTracks } from ".";

jest.mock("../UserProvider");

function renderHookWithLoggedInUser() {
    useUser.mockReturnValue({ user: sampleUser(1) });
    jest.spyOn(Users, "tracks").mockReturnValueOnce(sampleTracks());

    const wrapper = ({ children }) => <TracksProvider>{children}</TracksProvider>;
    return renderHook(() => useTracks(), { wrapper });
}

function createUploadFile(id) {
    return new File(["content"], `track ${id}.gpx`, { type: "application/gpx+xml" });
}

function createGPXFile(id) {
    const track = { ...sampleTrack(21), id, gpxfile_id: id, title: `track ${id}` };
    return { ...sampleGPXFile(21), id, filename: `track ${id}.gpx`, tracks: [track] };
}

function createSuccessfulUploadResponse(id) {
    return Promise.resolve({ status: 201, data: createGPXFile(id) });
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useTracks()", () => {
    describe("Default values", () => {
        test('"tracks" should default to empty list', () => {
            useUser.mockReturnValue({ user: null });

            const wrapper = ({ children }) => <TracksProvider>{children}</TracksProvider>;
            const { result } = renderHook(() => useTracks(), { wrapper });

            expect(result.current.tracks).toEqual([]);
        });
    });

    describe("Basic setup", () => {
        test("When calling useTracks() outside of a TracksProvider, throw error", () => {
            const { result } = renderHook(() => useTracks());
            expect(result.error).toEqual(new Error("useTracks must be used within a TracksProvider"));
        });
    });

    describe("With logged-in user", () => {
        test('When a user is logged-in, "tracks" should be an array containing the tracks of the user', async () => {
            const { result, waitForNextUpdate } = renderHookWithLoggedInUser();
            await waitForNextUpdate();

            expect(result.current.tracks).toBeNonEmptyArray();
        });

        test("When calling getTrack with track id 21, should return data of track 21", async () => {
            const { result, waitForNextUpdate } = renderHookWithLoggedInUser();

            await waitForNextUpdate();
            const track = result.current.getTrack(21);

            expect(track).toBeObject();
            expect(track).toEqual(sampleTrack(21));
        });

        test('When calling updateTrack, "tracks" should contain the updated track values', async () => {
            const oldTrack = sampleTrack(21);
            const updatedTrack = { ...oldTrack, title: "new title", activity_mode: 1 };
            jest.spyOn(Tracks, "update").mockReturnValueOnce(updatedTrack);

            const { result, waitForNextUpdate } = renderHookWithLoggedInUser();

            await waitForNextUpdate();
            await act(() => result.current.updateTrack(oldTrack, { title: "new title", activity_mode: 1 }));

            expect(result.current.tracks).toContain(updatedTrack);
        });

        test('When calling deleteTrack, the old track should be removed from "tracks"', async () => {
            const oldTrack = sampleTrack(21);
            jest.spyOn(Tracks, "delete").mockReturnValueOnce(204);

            const { result, waitForNextUpdate } = renderHookWithLoggedInUser();

            await waitForNextUpdate();
            await act(() => result.current.deleteTrack(oldTrack));

            expect(result.current.tracks).not.toContain(oldTrack);
        });

        test('When calling uploadTracks with 3 successfully uploaded files, should call handleUploadFinished with 3 files and 3 successful responses and add the uploaded files to "tracks"', async () => {
            const handleUploadFinished = jest.fn();
            const files = [createUploadFile(101), createUploadFile(102), createUploadFile(103)];

            jest.spyOn(GPXFiles, "upload")
                .mockReturnValueOnce(createSuccessfulUploadResponse(101))
                .mockReturnValueOnce(createSuccessfulUploadResponse(102))
                .mockReturnValueOnce(createSuccessfulUploadResponse(103));

            const { result, waitForNextUpdate } = renderHookWithLoggedInUser();

            await waitForNextUpdate();
            await act(() => result.current.uploadTracks(files, handleUploadFinished));

            expect(handleUploadFinished).toHaveBeenCalledWith(3, 3);
            expect(result.current.tracks).toHaveLength(8);
        });
    });

    describe("Without logged-in user", () => {});
});
