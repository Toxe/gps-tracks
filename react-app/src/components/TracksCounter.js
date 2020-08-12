export default function TracksCounter({tracks}) {
    if (!tracks || tracks.length <= 0)
        return "no tracks";

    return tracks.length === 1 ? "1 Track" : `${tracks.length} Tracks`;
}
