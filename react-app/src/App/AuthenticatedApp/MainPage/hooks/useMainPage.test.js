import { renderHook, act } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { useMainPage } from ".";

describe("useMainPage()", () => {
    describe("Mobile navigation", () => {
        test("Mobile navigation should be closed by default", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            expect(result.current.mobileNavigationOpen).toBeFalse();
        });

        test("When calling handleMobileNavigationToggle(), should toggle mobile navigation visibility", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.handleMobileNavigationToggle());
            expect(result.current.mobileNavigationOpen).toBeTrue();

            act(() => result.current.handleMobileNavigationToggle());
            expect(result.current.mobileNavigationOpen).toBeFalse();
        });
    });

    describe("Navigate to pages", () => {
        test("Can call navigateToEditTrack", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToEditTrack(1));
        });

        test("When calling navigateToAllTracks after deleting a track, should show trackDeletedSnackbar", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToAllTracks(1, true));

            expect(result.current.trackDeletedSnackbar).not.toBeNull();
        });

        test("When calling navigateToAllTracks without deleting a track, trackDeletedSnackbar should be null", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToAllTracks(1, false));

            expect(result.current.trackDeletedSnackbar).toBeNull();
        });

        test("When calling navigateToSingleTrack after saving changes, should show changesSavedSnackbar", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToSingleTrack(1, true));

            expect(result.current.changesSavedSnackbar).not.toBeNull();
        });

        test("When calling navigateToSingleTrack without saving changes, changesSavedSnackbar should be null", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToSingleTrack(1, false));

            expect(result.current.changesSavedSnackbar).toBeNull();
        });
    });

    describe("With visible ChangesSavedSnackbar", () => {
        test('When clicking on "Close" button, should set changesSavedSnackbar to null', async () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToSingleTrack(1, true));
            act(() => result.current.changesSavedSnackbar.props.handleRemove());

            expect(result.current.changesSavedSnackbar).toBeNull();
        });
    });

    describe("With visible TrackDeletedSnackbar", () => {
        test('When clicking on "Close" button, should set trackDeletedSnackbar to null', async () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToAllTracks(1, true));
            act(() => result.current.trackDeletedSnackbar.props.handleRemove());

            expect(result.current.trackDeletedSnackbar).toBeNull();
        });
    });
});
