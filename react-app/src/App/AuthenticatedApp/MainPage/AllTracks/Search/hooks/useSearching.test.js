import { renderHook, act } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook } from "../../../../../../test";
import * as useURLParamSearch from "./useURLParamSearch";
import { useSearching } from ".";

const tracks = [{ title: "Track 01" }, { title: "track 02" }, { title: "Track 3" }, { title: "Bike Tour D" }];

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    // remove all URL search params
    window.history.replaceState({}, "", window.location.pathname);
});

describe("useSearching()", () => {
    describe("With tracks", () => {
        test('When "searchText" is empty string, searchTracks should return all tracks', () => {
            spyOnHook(useURLParamSearch).mockReturnValue({ searchText: "" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchTracks(tracks)).toEqual(tracks);
        });

        test('When "searchText" is "track", searchTracks should return tracks 01, 02 and 3', () => {
            spyOnHook(useURLParamSearch).mockReturnValue({ searchText: "track" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            const searchedTracks = result.current.searchTracks(tracks);

            expect(searchedTracks).toHaveLength(3);
            expect(searchedTracks[0].title).toBe("Track 01");
            expect(searchedTracks[1].title).toBe("track 02");
            expect(searchedTracks[2].title).toBe("Track 3");
        });

        test('When "searchText" is "Track", searchTracks should return tracks 01, 02 and 3', () => {
            spyOnHook(useURLParamSearch).mockReturnValue({ searchText: "Track" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            const searchedTracks = result.current.searchTracks(tracks);

            expect(searchedTracks).toHaveLength(3);
            expect(searchedTracks[0].title).toBe("Track 01");
            expect(searchedTracks[1].title).toBe("track 02");
            expect(searchedTracks[2].title).toBe("Track 3");
        });

        test('When "searchText" is "0", searchTracks should return tracks 01 and 02', () => {
            spyOnHook(useURLParamSearch).mockReturnValue({ searchText: "0" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            const searchedTracks = result.current.searchTracks(tracks);

            expect(searchedTracks).toHaveLength(2);
            expect(searchedTracks[0].title).toBe("Track 01");
            expect(searchedTracks[1].title).toBe("track 02");
        });

        test('When "searchText" is "d", searchTracks should return track D', () => {
            spyOnHook(useURLParamSearch).mockReturnValue({ searchText: "d" });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            const searchedTracks = result.current.searchTracks(tracks);

            expect(searchedTracks).toHaveLength(1);
            expect(searchedTracks[0].title).toBe("Bike Tour D");
        });
    });

    describe("Without tracks", () => {
        test('When "tracks" is empty array, searchTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchTracks([])).toBeEmptyArray();
        });

        test('When "tracks" is null, searchTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchTracks(null)).toBeEmptyArray();
        });
    });

    describe("With URL params", () => {
        test('When changing searchText, should set "search" URL param', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            act(() => result.current.handleUpdateSearchText("search text"));

            const url = new URL(window.location.href);

            expect(result.current.searchText).toBe("search text");
            expect(url.searchParams.get("search")).toBe("search text");
        });

        test('When "search" URL param is set, should initialize to the same value', () => {
            const searchParams = new URLSearchParams({ search: "search text" });
            window.history.replaceState({}, "", `${window.location.pathname}?${searchParams}`);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchText).toBe("search text");
        });
    });
});
