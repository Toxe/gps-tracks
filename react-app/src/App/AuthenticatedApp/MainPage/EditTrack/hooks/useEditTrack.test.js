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

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useEditTrack()", () => {
    describe("Default values", () => {
        test('"track" should be the current track', () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            expect(result.current.track).toBe(track);
        });

        test('"requestError" should be null', () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            expect(result.current.requestError).toBeNull();
        });
    });

    describe("Saving changes", () => {
        test("When saving changes, should not show a request error", async () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            const updateTrack = jest.fn();
            useTracks.mockReturnValue({ getTrack, updateTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            const updateTrack = jest.fn(() => {
                throw new Error("something went wrong");
            });

            useTracks.mockReturnValue({ getTrack, updateTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            await act(() => result.current.handleSave({ title: "new title", activity_mode: 0 }));

            expect(updateTrack).toHaveBeenCalled();
            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Cancel changes", () => {
        test("When canceling changes, should navigate to single track page", () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            act(() => result.current.handleCancel());
        });
    });
});
