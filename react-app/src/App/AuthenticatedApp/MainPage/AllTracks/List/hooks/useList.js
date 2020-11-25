import { useState, useEffect, useCallback } from "react";

export default function useList(tracks, tracksPerPage) {
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [paginatedTracks, setPaginatedTracks] = useState(null);
    const [showPager, setShowPager] = useState(false);

    const update = useCallback(
        (newPage) => {
            const numTracks = tracks ? tracks.length : 0;
            const newNumPages = Math.ceil(numTracks / tracksPerPage);

            if (newPage < 1) {
                newPage = 1;
            } else if (newPage > newNumPages) {
                newPage = newNumPages;
            }

            setPage(newPage);
            setNumPages(newNumPages);
            setShowPager(numTracks > tracksPerPage && tracksPerPage > 0);

            if (numTracks > 0 && tracksPerPage > 0) {
                setPaginatedTracks(tracks.slice((newPage - 1) * tracksPerPage, newPage * tracksPerPage));
            } else {
                setPaginatedTracks(null);
            }
        },
        [tracks, tracksPerPage]
    );

    useEffect(() => {
        update(1);
    }, [update]);

    const handleChangePage = useCallback(
        (event, newPage) => {
            update(newPage);
        },
        [update]
    );

    return { showPager, numPages, page, paginatedTracks, handleChangePage };
}
