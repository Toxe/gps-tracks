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

        test('"formValues" should contain the track title and activity mode', () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            expect(result.current.formValues).toBeObject();
            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
        });

        test('"formValuesChanged" should default to false', () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            expect(result.current.formValuesChanged).toBeFalse();
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

    describe("Changing form values", () => {
        test("When changing activity mode, formValues should change and formValuesChanged should be true", () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 1 } }));

            expect(result.current.formValues.activity_mode).toBe(1);
            expect(result.current.formValuesChanged).toBeTrue();
        });

        test("When changing activity mode back to its default value, formValues should not contain any changes and formValuesChanged should be false", () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 1 } }));
            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 0 } }));

            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
            expect(result.current.formValuesChanged).toBeFalse();
        });

        test("When changing track title, formValues should change and formValuesChanged should be true", () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            act(() => result.current.handleChange({ target: { name: "title", value: "new title" } }));

            expect(result.current.formValues.title).toBe("new title");
            expect(result.current.formValuesChanged).toBeTrue();
        });

        test("When changing title back to its default value, formValues should not contain any changes and formValuesChanged should be false", () => {
            const track = sampleTrack(21);
            const getTrack = jest.fn(() => track);
            useTracks.mockReturnValue({ getTrack });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useEditTrack(), { wrapper });

            act(() => result.current.handleChange({ target: { name: "title", value: "new title" } }));
            act(() => result.current.handleChange({ target: { name: "title", value: track.title } }));

            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
            expect(result.current.formValuesChanged).toBeFalse();
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

            await act(() => result.current.handleSave());

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

            await act(() => result.current.handleSave());

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
