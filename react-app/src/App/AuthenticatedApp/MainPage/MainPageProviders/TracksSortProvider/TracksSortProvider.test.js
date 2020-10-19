import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { TracksSortProvider, useTracksSort } from ".";

const exampleTracks = [
    { title: "B", length3d: 4000.0, time_start: "2020-10-19T17:09:57" },
    { title: "A", length3d: 3000.0, time_start: "2020-10-17T17:09:57" },
    { title: "C", length3d: 5000.0, time_start: "2020-10-21T17:09:57" },
];

function renderHookAndSortTracks(tracks, sortBy, sortOrder) {
    const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
    const { result } = renderHook(() => useTracksSort(), { wrapper });

    act(() => result.current.setSortBy(sortBy));
    act(() => result.current.setSortOrder(sortOrder));

    return result.current.sortTracks(tracks);
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useTracksSort()", () => {
    describe("Default values", () => {
        test('"sortBy" should default to ""', () => {
            const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
            const { result } = renderHook(() => useTracksSort(), { wrapper });

            expect(result.current.sortBy).toBe("date");
        });

        test('"sortOrder" should default to ""', () => {
            const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
            const { result } = renderHook(() => useTracksSort(), { wrapper });

            expect(result.current.sortOrder).toBe("desc");
        });
    });

    describe("Basic setup", () => {
        test("When calling useTracksSort() outside of a TracksSortProvider, throw error", () => {
            const { result } = renderHook(() => useTracksSort());
            expect(result.error).toEqual(new Error("useTracksSort must be used within a TracksSortProvider"));
        });
    });

    describe("With sorting tracks", () => {
        test("When sorting by name ascending, should return A, B and C", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "name", "asc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("A");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("C");
        });

        test("When sorting by name descending, should return C, B, A", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "name", "desc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("C");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("A");
        });

        test("When sorting by distance ascending, should return A, B and C", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "distance", "asc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("A");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("C");
        });

        test("When sorting by distance descending, should return C, B, A", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "distance", "desc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("C");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("A");
        });

        test("When sorting by date ascending, should return A, B and C", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "date", "asc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("A");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("C");
        });

        test("When sorting by date descending, should return C, B, A", () => {
            const sorted = renderHookAndSortTracks(exampleTracks, "date", "desc");

            expect(sorted).toBeArrayOfObjects();
            expect(sorted).toBeSameLengthAs(exampleTracks);
            expect(sorted[0].title).toBe("C");
            expect(sorted[1].title).toBe("B");
            expect(sorted[2].title).toBe("A");
        });
    });

    describe("Without tracks", () => {
        test("When calling sortTracks with an empty tracks list, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
            const { result } = renderHook(() => useTracksSort(), { wrapper });

            expect(result.current.sortTracks([])).toEqual([]);
        });

        test("When calling sortTracks with null, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
            const { result } = renderHook(() => useTracksSort(), { wrapper });

            expect(result.current.sortTracks(null)).toEqual([]);
        });

        test("When calling sortTracks with undefined, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSortProvider>{children}</TracksSortProvider>;
            const { result } = renderHook(() => useTracksSort(), { wrapper });

            expect(result.current.sortTracks(undefined)).toEqual([]);
        });
    });
});
