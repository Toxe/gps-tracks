import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { useTracks } from "../../../TracksProvider";
import { useNavigation } from ".";
import { sampleTracks } from "../../../../../test";

jest.mock("../../../TracksProvider");

function renderUseNavigationHook(tracks, mobileNavigationOpen = false) {
    const handleMobileNavigationToggle = jest.fn();
    const navigateToAllTracks = jest.fn();

    useTracks.mockReturnValue({ tracks });

    return {
        ...renderHook(() => useNavigation(mobileNavigationOpen, handleMobileNavigationToggle, navigateToAllTracks)),
        handleMobileNavigationToggle,
        navigateToAllTracks,
    };
}

describe("useNavigation()", () => {
    describe("With sample tracks", () => {
        test("countedActivities should contain correct data", () => {
            const { result } = renderUseNavigationHook(sampleTracks());

            expect(result.current.countedActivities).not.toBeUndefined();
            expect(result.current.countedActivities).not.toBeEmpty();
            expect(result.current.countedActivities.get(0)).toBe(3);
            expect(result.current.countedActivities.get(1)).toBe(2);
        });

        test("countedYears should contain correct data", () => {
            const { result } = renderUseNavigationHook(sampleTracks());

            expect(result.current.countedYears).not.toBeUndefined();
            expect(result.current.countedYears).not.toBeEmpty();
            expect(result.current.countedYears.get(2017)).toBe(2);
            expect(result.current.countedYears.get(2018)).toBe(3);
        });

        test("When calling handleNavigationClick, should call navigateToAllTracks", () => {
            const { result, navigateToAllTracks } = renderUseNavigationHook(null);

            act(() => result.current.handleNavigationClick(""));

            expect(navigateToAllTracks).toHaveBeenCalled();
        });

        test("When calling handleNavigationClick and mobileNavigationOpen is true, should call handleMobileNavigationToggle", () => {
            const { result, handleMobileNavigationToggle } = renderUseNavigationHook(null, true);

            act(() => result.current.handleNavigationClick(""));

            expect(handleMobileNavigationToggle).toHaveBeenCalled();
        });
    });

    describe("With tracks being empty", () => {
        test("numTracks should be 0", () => {
            const { result } = renderUseNavigationHook([]);
            expect(result.current.numTracks).toBe(0);
        });

        test("countedActivities should be undefined", () => {
            const { result } = renderUseNavigationHook([]);
            expect(result.current.countedActivities).toBeUndefined();
        });

        test("countedYears should be undefined", () => {
            const { result } = renderUseNavigationHook([]);
            expect(result.current.countedYears).toBeUndefined();
        });
    });

    describe("With tracks being null", () => {
        test("numTracks should be 0", () => {
            const { result } = renderUseNavigationHook(null);
            expect(result.current.numTracks).toBe(0);
        });

        test("countedActivities should be undefined", () => {
            const { result } = renderUseNavigationHook(null);
            expect(result.current.countedActivities).toBeUndefined();
        });

        test("countedYears should be undefined", () => {
            const { result } = renderUseNavigationHook(null);
            expect(result.current.countedYears).toBeUndefined();
        });
    });
});
