import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { sampleTracks } from "../../../../../test";
import { useTracks } from "../../../TracksProvider";
import { MainPageProviders } from "../../MainPageProviders";
import { useAllTracks } from ".";

jest.mock("../../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useAllTracks()", () => {
    describe("With tracks", () => {
        test("When all filters are set to default, should return list of all tracks", () => {
            const tracks = sampleTracks();

            useTracks.mockReturnValue({ tracks });

            const wrapper = ({ children }) => (
                <BrowserRouter>
                    <MainPageProviders>{children}</MainPageProviders>
                </BrowserRouter>
            );
            const { result } = renderHook(() => useAllTracks(), { wrapper });

            expect(result.current.filteredAndSortedTracks).toHaveLength(tracks.length);
        });
    });
});
