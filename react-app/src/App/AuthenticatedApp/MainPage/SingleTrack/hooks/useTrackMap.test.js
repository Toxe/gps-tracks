import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleTrack, sampleTrackSegments } from "../../../../../test";
import { Tracks } from "../../../api";
import { useTrackMap } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useTrackMap()", () => {
    test('When "track" is null, should return "segments" and "bounds" as null', () => {
        const { result } = renderHook(() => useTrackMap(null));

        expect(result.current.segments).toBeNull();
        expect(result.current.bounds).toBeNull();
    });

    test('When "track" is valid, should return valid "segments" and "bounds"', async () => {
        jest.spyOn(Tracks, "segments").mockReturnValueOnce(sampleTrackSegments());

        const { result, waitForNextUpdate } = renderHook(() => useTrackMap(sampleTrack(21)));

        await waitForNextUpdate();

        expect(result.current.segments).toBeArray();
        expect(result.current.bounds).toBeObject();
    });
});
