import "../../../../i18n-tests";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
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
        test("Can call navigateToAllTracks", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToAllTracks(null));
        });

        test("Can call navigateToEditTrack", () => {
            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useMainPage(), { wrapper });

            act(() => result.current.navigateToEditTrack(1));
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
});
