import { useState, useEffect } from "react";

export default function useList(tracks, tracksPerPage) {
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [paginatedTracks, setPaginatedTracks] = useState(null);
    const [showPager, setShowPager] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [tracks]);

    useEffect(() => {
        if (tracks && tracks.length > 0 && tracksPerPage > 0) {
            setNumPages(Math.ceil(tracks.length / tracksPerPage));
            setPaginatedTracks(tracks.slice((page - 1) * tracksPerPage, page * tracksPerPage));
            setShowPager(tracks.length > tracksPerPage);
        } else {
            setNumPages(0);
            setPaginatedTracks(null);
            setShowPager(false);
        }
    }, [page, tracks, tracksPerPage]);

    const handleChangePage = (event, newPage) => {
        if (newPage < 1) {
            newPage = 1;
        } else if (newPage > numPages) {
            newPage = numPages;
        }

        setPage(newPage);
    };

    return { showPager, numPages, page, paginatedTracks, handleChangePage };
}
