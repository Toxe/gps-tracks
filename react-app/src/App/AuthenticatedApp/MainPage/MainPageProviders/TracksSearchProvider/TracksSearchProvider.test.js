import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { TracksSearchProvider, useTracksSearch } from ".";

const exampleTracks = [{ title: "AA" }, { title: "aa" }, { title: "BB" }, { title: "bbCC" }, { title: "ccDD" }];

function renderHookAndSearchTracks(tracks, searchText) {
    const wrapper = ({ children }) => <TracksSearchProvider>{children}</TracksSearchProvider>;
    const { result } = renderHook(() => useTracksSearch(), { wrapper });

    act(() => result.current.setSearchText(searchText));

    return result.current.searchTracks(tracks);
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useTracksSearch()", () => {
    describe("Default values", () => {
        test('"searchText" should default to ""', () => {
            const wrapper = ({ children }) => <TracksSearchProvider>{children}</TracksSearchProvider>;
            const { result } = renderHook(() => useTracksSearch(), { wrapper });

            expect(result.current.searchText).toBe("");
        });
    });

    describe("Basic setup", () => {
        test("When calling useTracksSearch() outside of a TracksSearchProvider, throw error", () => {
            const { result } = renderHook(() => useTracksSearch());
            expect(result.error).toEqual(new Error("useTracksSearch must be used within a TracksSearchProvider"));
        });
    });

    describe("With searching tracks", () => {
        test('When searching for "aa", should return AA, bb', () => {
            const searched = renderHookAndSearchTracks(exampleTracks, "aa");

            expect(searched).toBeArrayOfObjects();
            expect(searched).toHaveLength(2);
            expect(searched[0].title).toBe("AA");
            expect(searched[1].title).toBe("aa");
        });

        test('When searching for "BB", should return BB, bbCC', () => {
            const searched = renderHookAndSearchTracks(exampleTracks, "BB");

            expect(searched).toBeArrayOfObjects();
            expect(searched).toHaveLength(2);
            expect(searched[0].title).toBe("BB");
            expect(searched[1].title).toBe("bbCC");
        });

        test('When searching for "EE", should return empty array', () => {
            const searched = renderHookAndSearchTracks(exampleTracks, "EE");

            expect(searched).toBeEmptyArray();
        });
    });

    describe("Without tracks", () => {
        test("When calling searchTracks with an empty tracks list, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSearchProvider>{children}</TracksSearchProvider>;
            const { result } = renderHook(() => useTracksSearch(), { wrapper });

            expect(result.current.searchTracks([])).toEqual([]);
        });

        test("When calling searchTracks with null, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSearchProvider>{children}</TracksSearchProvider>;
            const { result } = renderHook(() => useTracksSearch(), { wrapper });

            expect(result.current.searchTracks(null)).toEqual([]);
        });

        test("When calling searchTracks with undefined, should return empty list", () => {
            const wrapper = ({ children }) => <TracksSearchProvider>{children}</TracksSearchProvider>;
            const { result } = renderHook(() => useTracksSearch(), { wrapper });

            expect(result.current.searchTracks(undefined)).toEqual([]);
        });
    });
});
