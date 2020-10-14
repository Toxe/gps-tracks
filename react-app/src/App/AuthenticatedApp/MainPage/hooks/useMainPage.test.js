import "../../../../i18n-tests";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { useMainPage } from ".";

describe("useMainPage()", () => {
    describe("Mobile navigation", () => {
        test("Mobile navigation should be closed by default", () => {
            const { result } = renderHook(() => useMainPage());

            expect(result.current.mobileNavigationOpen).toBeFalse();
        });

        test("When calling handleMobileNavigationToggle(), should toggle mobile navigation visibility", () => {
            const { result } = renderHook(() => useMainPage());

            act(() => result.current.handleMobileNavigationToggle());
            expect(result.current.mobileNavigationOpen).toBeTrue();

            act(() => result.current.handleMobileNavigationToggle());
            expect(result.current.mobileNavigationOpen).toBeFalse();
        });
    });
});
