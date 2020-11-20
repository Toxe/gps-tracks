import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook } from "../../../../../../test";
import * as useURLParamActivity from "./useURLParamActivity";
import * as useURLParamYear from "./useURLParamYear";
import { useFiltering } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    // remove all URL search params
    window.history.replaceState({}, "", window.location.pathname);
});

describe("useFiltering()", () => {
    describe("With tracks, checking available activities", () => {
        test('When having only activity 0, should return activities list ["0"]', () => {
            const tracks = [
                { activity_mode: 0, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2018-06-02T13:18:14.999000" },
            ];

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            expect(result.current.availableActivities).toBeArrayOfStrings();
            expect(result.current.availableActivities).toHaveLength(1);
            expect(result.current.availableActivities).toEqual(["0"]);
        });

        test('When having only activity 1, should return activities list ["1"]', () => {
            const tracks = [
                { activity_mode: 1, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2018-06-02T13:18:14.999000" },
            ];

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            expect(result.current.availableActivities).toBeArrayOfStrings();
            expect(result.current.availableActivities).toHaveLength(1);
            expect(result.current.availableActivities).toEqual(["1"]);
        });

        test('When having activities 0 and 1, should return activities list ["0", "1"]', () => {
            const tracks = [
                { activity_mode: 1, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2018-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2019-06-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2020-06-02T13:18:14.999000" },
            ];

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            expect(result.current.availableActivities).toBeArrayOfStrings();
            expect(result.current.availableActivities).toHaveLength(2);
            expect(result.current.availableActivities).toContainValues(["0", "1"]);
        });
    });

    describe("With tracks, checking available years", () => {
        test('When having only year 2016, should return years list ["2016"]', () => {
            const tracks = [
                { activity_mode: 0, time_start: "2016-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2016-08-12T13:18:14.999000" },
            ];

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            expect(result.current.availableYears).toBeArrayOfStrings();
            expect(result.current.availableYears).toHaveLength(1);
            expect(result.current.availableYears).toEqual(["2016"]);
        });

        test('When having years 2016 and 2017, should return years list ["2016", "2017"]', () => {
            const tracks = [
                { activity_mode: 1, time_start: "2017-02-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2016-03-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2016-04-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2017-05-02T13:18:14.999000" },
            ];

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            expect(result.current.availableYears).toBeArrayOfStrings();
            expect(result.current.availableYears).toHaveLength(2);
            expect(result.current.availableYears).toContainValues(["2016", "2017"]);
        });
    });

    describe('With tracks and activityFilter == "" and yearFilter == ""', () => {
        test("When calling filterTracks, should return all tracks", () => {
            const tracks = [
                { activity_mode: 0, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2018-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeArrayOfObjects();
            expect(filteredTracks).toBeSameLengthAs(tracks);
            expect(filteredTracks).toContainValues(tracks);
        });
    });

    describe('With tracks and activityFilter == "all" and yearFilter == "all"', () => {
        test("When calling filterTracks, should return all tracks", () => {
            const tracks = [
                { activity_mode: 0, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2018-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "all" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "all" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeArrayOfObjects();
            expect(filteredTracks).toBeSameLengthAs(tracks);
            expect(filteredTracks).toContainValues(tracks);
        });
    });

    describe("With tracks and filtering by activity", () => {
        test('When activityFilter is "1", should return only tracks with activity_mode == 1', () => {
            const tracks = [
                { activity_mode: 1, time_start: "2017-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2018-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2019-06-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2020-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "1" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeArrayOfObjects();
            expect(filteredTracks).toHaveLength(2);
            expect(filteredTracks[0].activity_mode).toBe(1);
            expect(filteredTracks[1].activity_mode).toBe(1);
        });

        test('When activityFilter is "1" and no tracks with activity_mode == 1 exist, should return empty array', () => {
            const tracks = [
                { activity_mode: 0, time_start: "2018-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2019-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "1" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeEmptyArray();
        });
    });

    describe("With tracks and filtering by year", () => {
        test('When yearFilter is "2020", should return only tracks with time_start of 2020', () => {
            const tracks = [
                { activity_mode: 1, time_start: "2017-01-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2020-02-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2019-03-02T13:18:14.999000" },
                { activity_mode: 1, time_start: "2020-04-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "2020" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeArrayOfObjects();
            expect(filteredTracks).toHaveLength(2);
            expect(filteredTracks[0].time_start).toMatch(/^2020-/);
            expect(filteredTracks[1].time_start).toMatch(/^2020-/);
        });

        test('When yearFilter is "2020" and no tracks with time_start of 2020 exist, should return empty array', () => {
            const tracks = [
                { activity_mode: 0, time_start: "2018-06-02T13:18:14.999000" },
                { activity_mode: 0, time_start: "2019-06-02T13:18:14.999000" },
            ];

            spyOnHook(useURLParamActivity).mockReturnValue({ activityFilter: "" });
            spyOnHook(useURLParamYear).mockReturnValue({ yearFilter: "2020" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(tracks), { wrapper });

            const filteredTracks = result.current.filterTracks();

            expect(filteredTracks).toBeEmptyArray();
        });
    });

    describe("Without tracks, checking filterTracks returns", () => {
        test('When "tracks" is empty array, filterTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering([]), { wrapper });

            expect(result.current.filterTracks()).toBeEmptyArray();
        });

        test('When "tracks" is null, filterTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(null), { wrapper });

            expect(result.current.filterTracks()).toBeEmptyArray();
        });
    });

    describe("Without tracks, checking available activities and years", () => {
        test('When "tracks" is empty array, available activities and years should be empty arrays', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering([]), { wrapper });

            expect(result.current.availableActivities).toBeEmptyArray();
            expect(result.current.availableYears).toBeEmptyArray();
        });

        test('When "tracks" is null, available activities and years should be empty arrays', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering(null), { wrapper });

            expect(result.current.availableActivities).toBeEmptyArray();
            expect(result.current.availableYears).toBeEmptyArray();
        });
    });

    describe("With URL params", () => {
        test('When changing activityFilter, should set "activity" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering([]), { wrapper });

            act(() => result.current.handleChangeActivityFilter("1"));

            const url = new URL(window.location.href);

            expect(result.current.activityFilter).toBe("1");
            expect(url.searchParams.get("activity")).toBe("1");
        });

        test('When changing yearFilter, should set "year" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering([]), { wrapper });

            act(() => result.current.handleChangeYearFilter("2020"));

            const url = new URL(window.location.href);

            expect(result.current.yearFilter).toBe("2020");
            expect(url.searchParams.get("year")).toBe("2020");
        });

        test('When "activity" and "year" URLs params are set, should initialize to the same values', () => {
            const searchParams = new URLSearchParams({ activity: "1", year: "2020" });
            window.history.replaceState({}, "", `${window.location.pathname}?${searchParams}`);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useFiltering([]), { wrapper });

            expect(result.current.activityFilter).toBe("1");
            expect(result.current.yearFilter).toBe("2020");
        });
    });
});
