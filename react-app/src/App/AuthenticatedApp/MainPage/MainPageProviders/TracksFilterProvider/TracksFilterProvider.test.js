import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { TracksFilterProvider, useTracksFilter } from ".";

const exampleTracks = [
    { id: 1, activity_mode: 0, time_start: "2020-10-17T17:09:57" },
    { id: 2, activity_mode: 1, time_start: "2020-10-18T17:09:57" },
    { id: 3, activity_mode: 1, time_start: "2019-09-15T17:09:57" },
    { id: 4, activity_mode: 0, time_start: "2019-09-16T17:09:57" },
    { id: 5, activity_mode: 1, time_start: "2020-10-19T17:09:57" },
    { id: 6, activity_mode: 1, time_start: "2018-04-24T17:09:57" },
];

function renderHookAndFilterTracks(tracks, activity, year) {
    const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
    const { result } = renderHook(() => useTracksFilter(), { wrapper });

    act(() => result.current.setActivityFilter(activity));
    act(() => result.current.setYearFilter(year));

    return result.current.filterTracks(tracks);
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useTracksFilter()", () => {
    describe("Default values", () => {
        test('"activityFilter" should default to ""', () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.activityFilter).toBe("");
        });

        test('"yearFilter" should default to ""', () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.yearFilter).toBe("");
        });

        test('"availableActivities" should default to empty list', () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.availableActivities).toEqual([]);
        });

        test('"availableYears" should default to empty list', () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.availableYears).toEqual([]);
        });
    });

    describe("Basic setup", () => {
        test("When calling useTracksFilter() outside of a TracksFilterProvider, throw error", () => {
            const { result } = renderHook(() => useTracksFilter());
            expect(result.error).toEqual(new Error("useTracksFilter must be used within a TracksFilterProvider"));
        });
    });

    describe("With filtering tracks", () => {
        test('When filtering by activity "" and year "", should return all tracks', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "", "");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toBeSameLengthAs(exampleTracks);
            expect(filtered[0].id).toBe(1);
            expect(filtered[1].id).toBe(2);
            expect(filtered[2].id).toBe(3);
            expect(filtered[3].id).toBe(4);
            expect(filtered[4].id).toBe(5);
            expect(filtered[5].id).toBe(6);
        });

        test('When filtering by activity "all" and year "all", should return all tracks', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "all", "all");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toBeSameLengthAs(exampleTracks);
            expect(filtered[0].id).toBe(1);
            expect(filtered[1].id).toBe(2);
            expect(filtered[2].id).toBe(3);
            expect(filtered[3].id).toBe(4);
            expect(filtered[4].id).toBe(5);
            expect(filtered[5].id).toBe(6);
        });

        test('When filtering by activity "0" and year "", should return tracks 1, 4', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "0", "");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toHaveLength(2);
            expect(filtered[0].id).toBe(1);
            expect(filtered[1].id).toBe(4);
        });

        test('When filtering by activity "1" and year "all", should return tracks 2, 3, 5, 6', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "1", "all");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toHaveLength(4);
            expect(filtered[0].id).toBe(2);
            expect(filtered[1].id).toBe(3);
            expect(filtered[2].id).toBe(5);
            expect(filtered[3].id).toBe(6);
        });

        test('When filtering by activity "" and year "2020", should return tracks 1, 2, 5', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "", "2020");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toHaveLength(3);
            expect(filtered[0].id).toBe(1);
            expect(filtered[1].id).toBe(2);
            expect(filtered[2].id).toBe(5);
        });

        test('When filtering by activity "all" and year "2019", should return tracks 3, 4', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "all", "2019");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toHaveLength(2);
            expect(filtered[0].id).toBe(3);
            expect(filtered[1].id).toBe(4);
        });

        test('When filtering by activity "1" and year "2018", should return track 6', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "1", "2018");

            expect(filtered).toBeArrayOfObjects();
            expect(filtered).toHaveLength(1);
            expect(filtered[0].id).toBe(6);
        });

        test('When filtering by activity "0" and year "2018", should return empty list', () => {
            const filtered = renderHookAndFilterTracks(exampleTracks, "0", "2018");

            expect(filtered).toBeEmptyArray();
        });
    });

    describe("Without tracks", () => {
        test("When calling filterTracks with an empty tracks list, should return empty list", () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.filterTracks([])).toEqual([]);
        });

        test("When calling filterTracks with null, should return empty list", () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.filterTracks(null)).toEqual([]);
        });

        test("When calling filterTracks with undefined, should return empty list", () => {
            const wrapper = ({ children }) => <TracksFilterProvider>{children}</TracksFilterProvider>;
            const { result } = renderHook(() => useTracksFilter(), { wrapper });

            expect(result.current.filterTracks(undefined)).toEqual([]);
        });
    });
});
