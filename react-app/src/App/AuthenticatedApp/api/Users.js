import axios from "axios";

export const Users = {
    get: async (id) => {
        if (!Number.isInteger(id)) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(`/api/users/${id}`);
        return response.data;
    },

    tracks: async (user) => {
        if (!user || "links" in user === false || "tracks" in user.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(user.links.tracks);
        return response.data;
    },
};
