import axios from "axios";

export const GPXFiles = {
    upload: async (user, file) => {
        if (!user || !file) {
            throw new TypeError("invalid arguments");
        }

        const formData = new FormData();
        formData.append("file", file);

        return await axios.post(`/api/users/${user.id}/gpxfiles`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
