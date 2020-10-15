import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleTrack } from "../../../../../test";
import { useEditTrackForm } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useEditTrackForm()", () => {
    describe("Default values", () => {
        test('"formValues" should contain the track title and activity mode', () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            expect(result.current.formValues).toBeObject();
            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
        });

        test('"formValuesChanged" should default to false', () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            expect(result.current.formValuesChanged).toBeFalse();
        });
    });

    describe("Changing form values", () => {
        test("When changing activity mode, formValues should change and formValuesChanged should be true", () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 1 } }));

            expect(result.current.formValues.activity_mode).toBe(1);
            expect(result.current.formValuesChanged).toBeTrue();
        });

        test("When changing activity mode back to its default value, formValues should not contain any changes and formValuesChanged should be false", () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 1 } }));
            act(() => result.current.handleChange({ target: { name: "activity_mode", value: 0 } }));

            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
            expect(result.current.formValuesChanged).toBeFalse();
        });

        test("When changing track title, formValues should change and formValuesChanged should be true", () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            act(() => result.current.handleChange({ target: { name: "title", value: "new title" } }));

            expect(result.current.formValues.title).toBe("new title");
            expect(result.current.formValuesChanged).toBeTrue();
        });

        test("When changing title back to its default value, formValues should not contain any changes and formValuesChanged should be false", () => {
            const track = sampleTrack(21);
            const { result } = renderHook(() => useEditTrackForm(track));

            act(() => result.current.handleChange({ target: { name: "title", value: "new title" } }));
            act(() => result.current.handleChange({ target: { name: "title", value: track.title } }));

            expect(result.current.formValues.title).toBe(track.title);
            expect(result.current.formValues.activity_mode).toBe(track.activity_mode);
            expect(result.current.formValuesChanged).toBeFalse();
        });
    });
});
