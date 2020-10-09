import { sampleTrack } from ".";

const gpxfiles = [
    {
        filename: "Track_021.gpx",
        id: 21,
        links: {
            download: "/api/users/1/gpxfiles/21/download/Track_021.gpx",
            owner: "/api/users/1",
        },
        time_imported: "2020-09-18T11:02:30.536996",
        tracks: [sampleTrack(21)],
        user_id: 1,
    },
    {
        filename: "Track_028.gpx",
        id: 28,
        links: {
            download: "/api/users/1/gpxfiles/28/download/Track_028.gpx",
            owner: "/api/users/1",
        },
        time_imported: "2020-09-18T11:02:30.536996",
        tracks: [sampleTrack(28)],
        user_id: 1,
    },
    {
        filename: "Track_047.gpx",
        id: 47,
        links: {
            download: "/api/users/1/gpxfiles/47/download/Track_021.gpx",
            owner: "/api/users/1",
        },
        time_imported: "2020-09-18T11:02:30.536996",
        tracks: [sampleTrack(47)],
        user_id: 1,
    },
    {
        filename: "Track_085.gpx",
        id: 85,
        links: {
            download: "/api/users/1/gpxfiles/85/download/Track_021.gpx",
            owner: "/api/users/1",
        },
        time_imported: "2020-09-18T11:02:30.536996",
        tracks: [sampleTrack(85)],
        user_id: 1,
    },
    {
        filename: "Track_087.gpx",
        id: 87,
        links: {
            download: "/api/users/1/gpxfiles/87/download/Track_021.gpx",
            owner: "/api/users/1",
        },
        time_imported: "2020-09-18T11:02:30.536996",
        tracks: [sampleTrack(87)],
        user_id: 1,
    },
];

export function sampleGPXFiles() {
    return gpxfiles;
}

export function sampleGPXFile(id) {
    if (Number.isInteger(id)) {
        return gpxfiles.find((t) => t.id === id);
    } else {
        return undefined;
    }
}
