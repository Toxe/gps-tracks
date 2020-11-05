import "../../../../../../i18n-tests";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { useUploadResultsSnackbar } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useUploadResultsSnackbar()", () => {
    describe("Default values", () => {
        test('"open" should default to true', () => {
            const { result } = renderHook(() => useUploadResultsSnackbar(1, 1));

            expect(result.current.open).toBeTrue();
        });
    });

    describe("With calling handleClose", () => {
        test('When calling handleClose with reason != "clickaway", should set open to false', () => {
            const { result } = renderHook(() => useUploadResultsSnackbar(1, 1));

            act(() => result.current.handleClose(undefined, "timeout"));

            expect(result.current.open).toBeFalse();
        });

        test('When calling handleClose with reason == "clickaway", should not set open to false', () => {
            const { result } = renderHook(() => useUploadResultsSnackbar(1, 1));

            act(() => result.current.handleClose(undefined, "clickaway"));

            expect(result.current.open).toBeTrue();
        });
    });
});
