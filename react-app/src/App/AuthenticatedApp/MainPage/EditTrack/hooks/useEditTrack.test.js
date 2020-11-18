import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleTrack } from "../../../../../test";
import { useTracks } from "../../../TracksProvider";
import { useEditTrack } from ".";

jest.mock("../../../TracksProvider");

function renderUseEditTrackHook(track, updateTrack, navigateToSingleTrack) {
    const getTrack = jest.fn(() => track);
    useTracks.mockReturnValue({ getTrack, updateTrack });

    return renderHook(() => useEditTrack(navigateToSingleTrack));
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useEditTrack()", () => {
    describe("Default values", () => {
        test('"track" should be the current track', () => {
            const track = sampleTrack(21);

            const { result } = renderUseEditTrackHook(track, null, null);

            expect(result.current.track).toBe(track);
        });

        test('"requestError" should be null', () => {
            const track = sampleTrack(21);
            const { result } = renderUseEditTrackHook(track, null, null);

            expect(result.current.requestError).toBeNull();
        });
    });

    describe("Saving changes", () => {
        test("When saving changes, should call navigateToSingleTrack", async () => {
            const track = sampleTrack(21);
            const navigateToSingleTrack = jest.fn();
            const updateTrack = jest.fn();

            const { result } = renderUseEditTrackHook(track, updateTrack, navigateToSingleTrack);

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(navigateToSingleTrack).toHaveBeenCalledWith(track.id, true);
        });

        test("When saving changes, should not show a request error", async () => {
            const track = sampleTrack(21);
            const navigateToSingleTrack = jest.fn();
            const updateTrack = jest.fn();

            const { result } = renderUseEditTrackHook(track, updateTrack, navigateToSingleTrack);

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const track = sampleTrack(21);
            const updateTrack = jest.fn(() => {
                throw new Error("something went wrong");
            });

            const { result } = renderUseEditTrackHook(track, updateTrack, jest.fn());

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(result.current.requestError).not.toBeNull();
        });

        test("When calling handleSave with invalid values, should throw TypeError", async () => {
            const track = sampleTrack(21);
            const updateTrack = jest.fn();

            const { result } = renderUseEditTrackHook(track, updateTrack, jest.fn());

            expect.assertions(1);
            await expect(result.current.handleSave(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Cancel changes", () => {
        test("When canceling changes, should call navigateToSingleTrack", () => {
            const track = sampleTrack(21);
            const navigateToSingleTrack = jest.fn();

            const { result } = renderUseEditTrackHook(track, null, navigateToSingleTrack);

            act(() => result.current.handleCancel());

            expect(navigateToSingleTrack).toHaveBeenCalledWith(track.id, false);
        });
    });
});
