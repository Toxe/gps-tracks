import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook } from "../../../../../../test";
import * as useURLParamSortBy from "./useURLParamSortBy";
import * as useURLParamSortOrder from "./useURLParamSortOrder";
import { useSorting } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    // remove all URL search params
    window.history.replaceState({}, "", window.location.pathname);
});

describe("useSorting()", () => {
    describe("With changing sortBy", () => {
        test('When changing to date, should set sortOrder to "desc"', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleChangeSortBy("date"));

            expect(result.current.sortBy).toBe("date");
            expect(result.current.sortOrder).toBe("desc");
        });

        test('When changing to distance, should set sortOrder to "desc"', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleChangeSortBy("distance"));

            expect(result.current.sortBy).toBe("distance");
            expect(result.current.sortOrder).toBe("desc");
        });

        test('When changing to name, should set sortOrder to "asc"', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleChangeSortBy("name"));

            expect(result.current.sortBy).toBe("name");
            expect(result.current.sortOrder).toBe("asc");
        });
    });

    describe('With sortBy set to default ("date")', () => {
        test('When set to default, should not set "sort" and "order" URL params', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleChangeSortBy("date"));

            expect(result.current.sortBy).toBe("date");
            expect(result.current.sortOrder).toBe("desc");

            const url = new URL(window.location.href);
            expect(url.searchParams.get("sort")).toBeNull();
            expect(url.searchParams.get("order")).toBeNull();
        });

        test('When switching sortOrder, should set "order" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleFlipSortOrder());

            expect(result.current.sortBy).toBe("date");
            expect(result.current.sortOrder).toBe("asc");

            const url = new URL(window.location.href);
            expect(url.searchParams.get("order")).toBe("asc");
        });

        test('When switching sortOrder back to its default value, should remove "order" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleFlipSortOrder());
            act(() => result.current.handleFlipSortOrder());

            expect(result.current.sortBy).toBe("date");
            expect(result.current.sortOrder).toBe("desc");

            const url = new URL(window.location.href);
            expect(url.searchParams.get("order")).toBeNull();
        });

        test('When setting sortBy to a different value, should only set "sort" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            act(() => result.current.handleChangeSortBy("name"));

            expect(result.current.sortBy).toBe("name");
            expect(result.current.sortOrder).toBe("asc");

            const url = new URL(window.location.href);
            expect(url.searchParams.get("sort")).toBe("name");
            expect(url.searchParams.get("order")).toBeNull();
        });
    });

    describe("With tracks, sorting by date", () => {
        test("When sorting in ascending order, should return tracks 2016, 2017 and 2018", () => {
            const tracks = [
                { title: "2018", time_start: "2018-06-02T13:18:14.999000" },
                { title: "2016", time_start: "2016-06-02T13:18:14.999000" },
                { title: "2017", time_start: "2017-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "date" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "asc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("2016");
            expect(sortedTracks[1].title).toBe("2017");
            expect(sortedTracks[2].title).toBe("2018");
        });

        test("When sorting in decending order, should return tracks 2018, 2017 and 2016", () => {
            const tracks = [
                { title: "2018", time_start: "2018-06-02T13:18:14.999000" },
                { title: "2016", time_start: "2016-06-02T13:18:14.999000" },
                { title: "2017", time_start: "2017-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "date" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "desc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("2018");
            expect(sortedTracks[1].title).toBe("2017");
            expect(sortedTracks[2].title).toBe("2016");
        });
    });

    describe("With tracks, sorting by distance", () => {
        test("When sorting in ascending order, should return tracks 100, 200 and 300", () => {
            const tracks = [
                { title: "300", length3d: 300.0 },
                { title: "100", length3d: 100.0 },
                { title: "200", length3d: 200.0 },
            ];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "distance" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "asc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("100");
            expect(sortedTracks[1].title).toBe("200");
            expect(sortedTracks[2].title).toBe("300");
        });

        test("When sorting in decending order, should return tracks 300, 200 and 100", () => {
            const tracks = [
                { title: "300", length3d: 300.0 },
                { title: "100", length3d: 100.0 },
                { title: "200", length3d: 200.0 },
            ];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "distance" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "desc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("300");
            expect(sortedTracks[1].title).toBe("200");
            expect(sortedTracks[2].title).toBe("100");
        });
    });

    describe("With tracks, sorting by name", () => {
        test("When sorting in ascending order, should return tracks A, B and C", () => {
            const tracks = [{ title: "C" }, { title: "A" }, { title: "B" }];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "name" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "asc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("A");
            expect(sortedTracks[1].title).toBe("B");
            expect(sortedTracks[2].title).toBe("C");
        });

        test("When sorting in decending order, should return tracks C, B and A", () => {
            const tracks = [{ title: "C" }, { title: "A" }, { title: "B" }];

            spyOnHook(useURLParamSortBy).mockReturnValue({ sortBy: "name" });
            spyOnHook(useURLParamSortOrder).mockReturnValue({ sortOrder: "desc" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            const sortedTracks = result.current.sortTracks(tracks);

            expect(sortedTracks).toBeArrayOfObjects();
            expect(sortedTracks).toBeSameLengthAs(tracks);
            expect(sortedTracks[0].title).toBe("C");
            expect(sortedTracks[1].title).toBe("B");
            expect(sortedTracks[2].title).toBe("A");
        });
    });

    describe("Without tracks", () => {
        test('When "tracks" is empty array, sortTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            expect(result.current.sortTracks([])).toBeEmptyArray();
        });

        test('When "tracks" is null, sortTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            expect(result.current.sortTracks(null)).toBeEmptyArray();
        });
    });

    describe("With URL params", () => {
        test('When "sort" and "order" URLs params are set, should initialize to the same values', () => {
            const searchParams = new URLSearchParams({ sort: "distance", order: "asc" });
            window.history.replaceState({}, "", `${window.location.pathname}?${searchParams}`);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSorting(), { wrapper });

            expect(result.current.sortBy).toBe("distance");
            expect(result.current.sortOrder).toBe("asc");
        });
    });
});
