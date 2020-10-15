import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { sampleTrack } from "../../../../../test";
import { useTracks } from "../../../TracksProvider";
import { useEditTrack } from ".";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

jest.mock("../../../TracksProvider");

function renderUseEditTrackHook(track, updateTrack) {
    const getTrack = jest.fn(() => track);
    useTracks.mockReturnValue({ getTrack, updateTrack });

    const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
    return renderHook(() => useEditTrack(), { wrapper });
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useEditTrack()", () => {
    describe("Default values", () => {
        test('"track" should be the current track', () => {
            const track = sampleTrack(21);
            const { result } = renderUseEditTrackHook(track, null);

            expect(result.current.track).toBe(track);
        });

        test('"requestError" should be null', () => {
            const track = sampleTrack(21);
            const { result } = renderUseEditTrackHook(track, null);

            expect(result.current.requestError).toBeNull();
        });
    });

    describe("Saving changes", () => {
        test("When saving changes, should not show a request error", async () => {
            const updateTrack = jest.fn();
            const track = sampleTrack(21);
            const { result } = renderUseEditTrackHook(track, updateTrack);

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const track = sampleTrack(21);
            const updateTrack = jest.fn(() => {
                throw new Error("something went wrong");
            });
            const { result } = renderUseEditTrackHook(track, updateTrack);

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Cancel changes", () => {
        test("When canceling changes, should navigate to single track page", () => {
            const track = sampleTrack(21);
            const { result } = renderUseEditTrackHook(track, null);

            act(() => result.current.handleCancel());
        });
    });
});
