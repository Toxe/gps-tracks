import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { saveAs as saveAsMock } from "file-saver";
import { sampleTrack } from "../../../../../test";
import { Tracks } from "../../../api";
import { useTracks } from "../../../TracksProvider";
import { useUser } from "../../../UserProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useSingleTrack } from ".";

jest.mock("file-saver");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

jest.mock("../../../TracksProvider");
jest.mock("../../../UserProvider");
jest.mock("../../MainPageProviders/LastVisitedAllTracksPageProvider");

function setupBasicMocks(getTrack, deleteTrack) {
    useTracks.mockReturnValue({ getTrack, deleteTrack });
    useUser.mockReturnValue({ user: 1 });
    useLastVisitedAllTracksPage.mockReturnValue({ returnToLastVisitedAllTracksPage: jest.fn() });
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useSingleTrack()", () => {
    describe("Delete track", () => {
        test("When deleting an existing track, should call deleteTrack() and not show a request error", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            const deleteTrack = jest.fn();

            setupBasicMocks(getTrack, deleteTrack);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSingleTrack(), { wrapper });

            await act(() => result.current.handleDeleteTrack());

            expect(deleteTrack).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            const deleteTrack = jest.fn(() => {
                throw new Error("something went wrong");
            });

            setupBasicMocks(getTrack, deleteTrack);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSingleTrack(), { wrapper });

            await act(() => result.current.handleDeleteTrack());

            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Download track", () => {
        test("When downloading an existing track, should not show a request error", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            setupBasicMocks(getTrack, null);

            const tracksDownload = jest
                .spyOn(Tracks, "download")
                .mockReturnValueOnce(new Blob(["content"], { type: "application/gpx+xml" }));

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSingleTrack(), { wrapper });

            await act(() => result.current.handleDownloadTrack());

            expect(tracksDownload).toHaveBeenCalled();
            expect(saveAsMock).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            setupBasicMocks(getTrack, null);

            jest.spyOn(Tracks, "download").mockImplementation(() => {
                throw new Error("something went wrong");
            });

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSingleTrack(), { wrapper });

            await act(() => result.current.handleDownloadTrack());

            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Navigate to edit track page", () => {
        test("When handleEditTrack() is called, should navigate to edit track page", () => {
            const getTrack = jest.fn(() => sampleTrack(21));
            setupBasicMocks(getTrack, null);

            const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
            const { result } = renderHook(() => useSingleTrack(), { wrapper });

            act(() => result.current.handleEditTrack());
        });
    });
});
