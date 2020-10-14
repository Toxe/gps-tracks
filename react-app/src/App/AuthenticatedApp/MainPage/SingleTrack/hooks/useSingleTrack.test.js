import React from "react";
import "../../../../../i18n-tests";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { BrowserRouter } from "react-router-dom";
import { saveAs as saveAsMock } from "file-saver";
import { sampleTrack } from "../../../../../test";
import { Tracks } from "../../../api";
import * as tracksProviderExports from "../../../TracksProvider/TracksProvider";
import * as userProviderExports from "../../../UserProvider/UserProvider";
import * as lastVisitedAllTracksPageProviderExports from "../../MainPageProviders/LastVisitedAllTracksPageProvider/LastVisitedAllTracksPageProvider";
import { useSingleTrack } from ".";

jest.mock("file-saver");
jest.mock("react-leaflet"); // don't actually render the Leaflet map
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // require the original module to not be mocked
    useNavigate: () => jest.fn(),
}));

function setupBasicMocks(getTrack, deleteTrack) {
    const returnToLastVisitedAllTracksPage = jest.fn();

    jest.spyOn(tracksProviderExports, "useTracks").mockReturnValue({ getTrack, deleteTrack });
    jest.spyOn(userProviderExports, "useUser").mockReturnValue({ user: 1 });
    jest.spyOn(lastVisitedAllTracksPageProviderExports, "useLastVisitedAllTracksPage").mockReturnValue({ returnToLastVisitedAllTracksPage });
}

afterEach(() => {
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
