import axios from "axios";

export class Tracks {
    static async update(track, values) {
        if (!track || "links" in track === false || "update" in track.links === false || !values) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.put(track.links.update, values);
        return response.data;
    }

    static async delete(track) {
        if (!track || "links" in track === false || "delete" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.delete(track.links.delete);
        return response.status;
    }

    static async download(track) {
        if (!track || "links" in track === false || "download" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(track.links.download, { responseType: "blob" });
        return response.data;
    }

    static async segments(track) {
        if (!track || "links" in track === false || "segments" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(track.links.segments);
        return response.data;
    }
}
