import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { saveAs as saveAsMock } from "file-saver";
import { sampleTrack } from "../../../../../test";
import { Tracks } from "../../../api";
import { useTracks } from "../../../TracksProvider";
import { useUser } from "../../../UserProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";
import { useSingleTrack } from ".";

jest.mock("file-saver");
jest.mock("../../../TracksProvider");
jest.mock("../../../UserProvider");
jest.mock("../../MainPageProviders/LastVisitedAllTracksPageProvider");

function setupBasicMocks(trackId, deleteTrack) {
    const getTrack = jest.fn(() => sampleTrack(trackId));
    const navigateToEditTrack = jest.fn();

    useTracks.mockReturnValue({ getTrack, deleteTrack });
    useUser.mockReturnValue({ user: 1 });
    useLastVisitedAllTracksPage.mockReturnValue({ returnToLastVisitedAllTracksPage: jest.fn() });

    return { navigateToEditTrack };
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useSingleTrack()", () => {
    describe("Delete track", () => {
        test("When deleting an existing track, should call deleteTrack() and not show a request error", async () => {
            const deleteTrack = jest.fn();
            const { navigateToEditTrack } = setupBasicMocks(21, deleteTrack);

            const { result } = renderHook(() => useSingleTrack(navigateToEditTrack));

            await act(() => result.current.handleDeleteTrack());

            expect(deleteTrack).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const deleteTrack = jest.fn(() => {
                throw new Error("something went wrong");
            });
            const { navigateToEditTrack } = setupBasicMocks(21, deleteTrack);

            const { result } = renderHook(() => useSingleTrack(navigateToEditTrack));

            await act(() => result.current.handleDeleteTrack());

            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Download track", () => {
        test("When downloading an existing track, should not show a request error", async () => {
            const { navigateToEditTrack } = setupBasicMocks(21, null);

            const tracksDownload = jest
                .spyOn(Tracks, "download")
                .mockReturnValueOnce(new Blob(["content"], { type: "application/gpx+xml" }));

            const { result } = renderHook(() => useSingleTrack(navigateToEditTrack));

            await act(() => result.current.handleDownloadTrack());

            expect(tracksDownload).toHaveBeenCalled();
            expect(saveAsMock).toHaveBeenCalled();
            expect(result.current.requestError).toBeNull();
        });

        test("When an exception is raised, should show request error", async () => {
            const { navigateToEditTrack } = setupBasicMocks(21, null);

            jest.spyOn(Tracks, "download").mockImplementation(() => {
                throw new Error("something went wrong");
            });

            const { result } = renderHook(() => useSingleTrack(navigateToEditTrack));

            await act(() => result.current.handleDownloadTrack());

            expect(result.current.requestError).not.toBeNull();
        });
    });

    describe("Navigate to edit track page", () => {
        test("When handleEditTrack() is called, should call navigateToEditTrack", () => {
            const { navigateToEditTrack } = setupBasicMocks(21, null);

            const { result } = renderHook(() => useSingleTrack(navigateToEditTrack));

            act(() => result.current.handleEditTrack());

            expect(navigateToEditTrack).toHaveBeenCalled();
        });
    });
});
