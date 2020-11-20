import { renderHook, act } from "@testing-library/react-hooks";
import { useAlertSnackbar } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useAlertSnackbar()", () => {
    describe("Default values", () => {
        test('"snackbar" should default to null', () => {
            const { result } = renderHook(() => useAlertSnackbar());
            const [snackbar] = result.current;

            expect(snackbar).toBeNull();
        });
    });

    describe("Showing new snackbar", () => {
        test("When calling showSnackbar with a message, should create a new snackbar with that message", () => {
            const { result } = renderHook(() => useAlertSnackbar());
            let [snackbar, showSnackbar] = result.current;

            act(() => showSnackbar("an alert message"));

            [snackbar] = result.current;
            expect(snackbar).not.toBeNull();
            expect(snackbar.props.message).toBe("an alert message");
        });

        test('When showing a new snackbar with default values, severity should be "success" and autoHideDuration should be 3000', () => {
            const { result } = renderHook(() => useAlertSnackbar());
            let [snackbar, showSnackbar] = result.current;

            act(() => showSnackbar("an alert message"));

            [snackbar] = result.current;
            expect(snackbar).not.toBeNull();
            expect(snackbar.props.severity).toBe("success");
            expect(snackbar.props.autoHideDuration).toBe(3000);
        });

        test("When showing a new snackbar with non-default values, should set severity and autoHideDuration props", () => {
            const { result } = renderHook(() => useAlertSnackbar());
            let [snackbar, showSnackbar] = result.current;

            act(() => showSnackbar("an alert message", "error", 1234));

            [snackbar] = result.current;
            expect(snackbar).not.toBeNull();
            expect(snackbar.props.severity).toBe("error");
            expect(snackbar.props.autoHideDuration).toBe(1234);
        });
    });

    describe("With existing snackbar", () => {
        test("When calling hideSnackbar, should set snackbar to null", () => {
            const { result } = renderHook(() => useAlertSnackbar());
            let [snackbar, showSnackbar, hideSnackbar] = result.current;

            act(() => showSnackbar("an alert message"));

            [snackbar, showSnackbar, hideSnackbar] = result.current;
            expect(snackbar).not.toBeNull();

            act(() => hideSnackbar());

            [snackbar, showSnackbar, hideSnackbar] = result.current;
            expect(snackbar).toBeNull();
        });
    });
});
