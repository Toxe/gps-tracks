import "../../../../../../i18n-tests";
import { renderHook, act } from "@testing-library/react-hooks";
import { useTracks } from "../../../../TracksProvider";
import { useUploadTrackButton } from ".";

jest.mock("../../../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useUploadTrackButton()", () => {
    describe("Default values", () => {
        test('"dialogVisible" should default to false', () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });
            const { result } = renderHook(() => useUploadTrackButton());

            expect(result.current.dialogVisible).toBeFalse();
        });

        test('"uploadInProgressSnackbar" should default to null', () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });
            const { result } = renderHook(() => useUploadTrackButton());

            expect(result.current.uploadInProgressSnackbar).toBeNull();
        });

        test('"uploadResultsSnackbar" should default to null', () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });
            const { result } = renderHook(() => useUploadTrackButton());

            expect(result.current.uploadResultsSnackbar).toBeNull();
        });
    });

    describe("With calling handleUpload", () => {
        test("When calling handleUpload, should create new UploadInProgressSnackbar", () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUpload([]));

            expect(result.current.uploadInProgressSnackbar).not.toBeNull();
            expect(result.current.uploadInProgressSnackbar).toBeObject();
        });

        test("When calling handleUpload, should set uploadResultsSnackbar to null", () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUpload([]));

            expect(result.current.uploadResultsSnackbar).toBeNull();
        });

        test("When calling handleUpload, should call uploadTracks", () => {
            const uploadTracks = jest.fn();
            useTracks.mockReturnValue({ uploadTracks });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUpload([]));

            expect(uploadTracks).toHaveBeenCalled();
        });
    });

    describe("With calling handleUploadFinished from uploadTracks", () => {
        test("When calling handleUploadFinished, should create new UploadResultsSnackbar", () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUploadFinished(1, 1));

            expect(result.current.uploadResultsSnackbar).not.toBeNull();
            expect(result.current.uploadResultsSnackbar).toBeObject();
        });

        test("When calling handleUploadFinished, should set dialogVisible to false", () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUploadFinished(1, 1));

            expect(result.current.dialogVisible).toBeFalse();
        });

        test("When calling handleUploadFinished, should set uploadInProgressSnackbar to null", () => {
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { result } = renderHook(() => useUploadTrackButton());
            act(() => result.current.handleUploadFinished(1, 1));

            expect(result.current.uploadInProgressSnackbar).toBeNull();
        });
    });
});
