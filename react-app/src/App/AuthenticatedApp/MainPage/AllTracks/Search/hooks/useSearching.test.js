import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { spyOnHook } from "../../../../../../test";
import * as useURLParamSearch from "./useURLParamSearch";
import { useSearching } from ".";

const tracks = [{ title: "Track 01" }, { title: "track 02" }, { title: "Track 3" }, { title: "Bike Tour D" }];

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
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
        test('When "tracks" is null, searchTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchTracks(null)).toBeEmptyArray();
        });

        test('When "tracks" is empty array, searchTracks should return empty array', () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSearching(), { wrapper });

            expect(result.current.searchTracks([])).toBeEmptyArray();
        });
    });
});
