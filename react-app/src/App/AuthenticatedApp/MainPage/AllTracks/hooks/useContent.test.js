import { renderHook } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { sampleTracks } from "../../../../../test";
import { MainPageProviders } from "../../MainPageProviders";
import { useContent } from ".";

jest.mock("../../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useContent()", () => {
    describe("With filters set to default and passing sample tracks", () => {
        test('"filteredAndSortedTracks" should be list of all tracks', () => {
            const tracks = sampleTracks();

            const wrapper = ({ children }) => (
                <BrowserRouter>
                    <MainPageProviders>{children}</MainPageProviders>
                </BrowserRouter>
            );
            const { result } = renderHook(() => useContent(tracks), { wrapper });

            expect(result.current.filteredAndSortedTracks).toHaveLength(tracks.length);
        });

        test('"availableActivities" should be list of all activities', () => {
            const tracks = sampleTracks();

            const wrapper = ({ children }) => (
                <BrowserRouter>
                    <MainPageProviders>{children}</MainPageProviders>
                </BrowserRouter>
            );
            const { result } = renderHook(() => useContent(tracks), { wrapper });

            expect(result.current.availableActivities).toBeArrayOfStrings();
            expect(result.current.availableActivities).toHaveLength(2);
            expect(result.current.availableActivities).toEqual(["0", "1"]);
        });

        test('"availableYears" should be list of all years', () => {
            const tracks = sampleTracks();

            const wrapper = ({ children }) => (
                <BrowserRouter>
                    <MainPageProviders>{children}</MainPageProviders>
                </BrowserRouter>
            );
            const { result } = renderHook(() => useContent(tracks), { wrapper });

            expect(result.current.availableYears).toBeArrayOfStrings();
            expect(result.current.availableYears).toHaveLength(2);
            expect(result.current.availableYears).toEqual(["2018", "2017"]);
        });
    });
});
