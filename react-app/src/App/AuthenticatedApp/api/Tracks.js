import axios from "axios";

export const Tracks = {
    update: async (user, trackId, values) => {
        if (!user || !values || !Number.isInteger(trackId)) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.put(`/api/users/${user.id}/tracks/${trackId}`, values);
        return response.data;
    },

    delete: async (track) => {
        if (!track || "links" in track === false || "delete" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.delete(track.links.delete);
        return response.status;
    },

    download: async (track) => {
        if (!track || "links" in track === false || "download" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(track.links.download, { responseType: "blob" });
        return response.data;
    },

    segments: async (track) => {
        if (!track || "links" in track === false || "segments" in track.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(track.links.segments);
        return response.data;
    },
};
