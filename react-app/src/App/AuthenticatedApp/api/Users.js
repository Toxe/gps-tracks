import axios from "axios";

export class Users {
    static async get(id) {
        if (!Number.isInteger(id)) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(`/api/users/${id}`);
        return response.data;
    }

    static async tracks(user) {
        if (!user || "links" in user === false || "tracks" in user.links === false) {
            throw new TypeError("invalid arguments");
        }

        const response = await axios.get(user.links.tracks);
        return response.data;
    }
}
