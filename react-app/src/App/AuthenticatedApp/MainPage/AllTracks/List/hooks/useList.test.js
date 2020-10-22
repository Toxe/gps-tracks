import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { useList } from ".";

function generateTracks(length, offset=0) {
    return Array(length).map((_, i) => i + 1 + offset);
}

describe("useList()", () => {
    describe("With tracks", () => {
        test("When tracks contains 5 tracks and tracksPerPage is 10, should show all tracks and no pager", () => {
            const tracks = generateTracks(5);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeFalse();
            expect(result.current.paginatedTracks).toHaveLength(tracks.length);
        });

        test("When tracks contains 10 tracks and tracksPerPage is 10, should show all tracks and no pager", () => {
            const tracks = generateTracks(10);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeFalse();
            expect(result.current.paginatedTracks).toHaveLength(tracks.length);
        });

        test("When tracks contains 20 tracks and tracksPerPage is 10, should show the first 10 tracks and a pager with 2 pages", () => {
            const tracks = generateTracks(20);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeTrue();
            expect(result.current.numPages).toBe(2);
            expect(result.current.page).toBe(1);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10));
        });

        test("When tracks contains 21 tracks and tracksPerPage is 10, should show the first 10 tracks and a pager with 3 pages", () => {
            const tracks = generateTracks(21);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeTrue();
            expect(result.current.numPages).toBe(3);
            expect(result.current.page).toBe(1);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10));
        });

        test("When tracks contains 29 tracks and tracksPerPage is 10, should show the first 10 tracks and a pager with 3 pages", () => {
            const tracks = generateTracks(29);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeTrue();
            expect(result.current.numPages).toBe(3);
            expect(result.current.page).toBe(1);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10));
        });
    });

    describe("Without tracks", () => {
        test("When tracks is null, should show no tracks and no pager", () => {
            const tracks = null;
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeFalse();
            expect(result.current.paginatedTracks).toBeNull();
        });

        test("When tracks is an empty array, should show no tracks and no pager", () => {
            const tracks = [];
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeFalse();
            expect(result.current.paginatedTracks).toBeNull();
        });

        test("When tracksPerPage is 0 or less, should show no tracks and no pager", () => {
            const tracks = generateTracks(5);
            const tracksPerPage = 0;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            expect(result.current.showPager).toBeFalse();
            expect(result.current.paginatedTracks).toBeNull();
        });
    });

    describe("With 50 tracks and 5 pages", () => {
        test("When calling handleChangePage with page 3, should switch to page 3 and show tracks 21 to 30", () => {
            const tracks = generateTracks(50);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            act(() => result.current.handleChangePage(null, 3));

            expect(result.current.page).toBe(3);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10, 20));
        });

        test("When calling handleChangePage with a page greater than numPages, should switch to last page and show tracks 41 to 50", () => {
            const tracks = generateTracks(50);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            act(() => result.current.handleChangePage(null, result.current.numPages + 1));

            expect(result.current.page).toBe(5);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10, 40));
        });

        test("When calling handleChangePage with a page lower than 1, should switch to first page and show tracks 1 to 10", () => {
            const tracks = generateTracks(50);
            const tracksPerPage = 10;

            const { result } = renderHook(() => useList(tracks, tracksPerPage));

            act(() => result.current.handleChangePage(null, 0));

            expect(result.current.page).toBe(1);
            expect(result.current.paginatedTracks).toEqual(generateTracks(10));
        });
    });
});
