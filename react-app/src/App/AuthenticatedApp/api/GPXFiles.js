import axios from "axios";

export class GPXFiles {
    static async upload(user, file) {
        if (!user || !file || "links" in user === false || "upload_gpxfile" in user.links === false) {
            throw new TypeError("invalid arguments");
        }

        const formData = new FormData();
        formData.append("file", file);

        return await axios.post(user.links.upload_gpxfile, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}
