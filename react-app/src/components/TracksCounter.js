export default function TracksCounter({count}) {
    if (count === 0)
        return "no tracks";

    return count === 1 ? "1 Track" : `${count} Tracks`;
}
