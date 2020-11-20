import { renderHook, act } from "@testing-library/react-hooks";
import { useUploadResultsSnackbar } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useUploadResultsSnackbar()", () => {
    describe("Default values", () => {
        test('"alertSnackbar" should default to null', () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            const [alertSnackbar] = result.current;

            expect(alertSnackbar).toBeNull();
        });
    });

    describe("With at least one successful upload", () => {
        it("Works for 1/1 successful uploads", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(1, 1));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("File successfully imported.");
            expect(alertSnackbar.props.severity).toBe("success");
            expect(alertSnackbar.props.autoHideDuration).toBe(5000);
        });

        it("Works for 3/3 successful uploads", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(3, 3));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("All files successfully imported.");
            expect(alertSnackbar.props.severity).toBe("success");
            expect(alertSnackbar.props.autoHideDuration).toBe(5000);
        });

        it("Works for 1/3 successful uploads", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(3, 1));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("1 out of 3 files successfully imported.");
            expect(alertSnackbar.props.severity).toBe("warning");
            expect(alertSnackbar.props.autoHideDuration).toBeNull();
        });
    });

    describe("All uploads failed", () => {
        it("Works for 0/1 successful uploads", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(1, 0));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("File could not be imported.");
            expect(alertSnackbar.props.severity).toBe("error");
            expect(alertSnackbar.props.autoHideDuration).toBeNull();
        });

        it("Works for 0/3 successful uploads", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(3, 0));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("No files could be imported.");
            expect(alertSnackbar.props.severity).toBe("error");
            expect(alertSnackbar.props.autoHideDuration).toBeNull();
        });

        it("Works with no upload files", () => {
            const { result } = renderHook(() => useUploadResultsSnackbar());
            let [alertSnackbar, showAlertSnackbar] = result.current;

            act(() => showAlertSnackbar(0, 0));

            [alertSnackbar] = result.current;
            expect(alertSnackbar.props.message).toBe("No files could be imported.");
            expect(alertSnackbar.props.severity).toBe("error");
            expect(alertSnackbar.props.autoHideDuration).toBeNull();
        });
    });
});
