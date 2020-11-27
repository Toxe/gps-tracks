import { useEffect } from "react";
import { useTracks } from "../../../TracksProvider";
import { useLastVisitedAllTracksPage } from "../../MainPageProviders/LastVisitedAllTracksPageProvider";

export default function useAllTracks() {
    const { tracks } = useTracks();
    const { updateLastVisitedAllTracksPage } = useLastVisitedAllTracksPage();

    useEffect(() => {
        updateLastVisitedAllTracksPage();
    }, [updateLastVisitedAllTracksPage]);

    return { tracks };
}
