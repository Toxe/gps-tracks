const users = [
    {
        id: 1,
        links: {
            gpxfiles: "/api/users/1/gpxfiles",
            tracks: "/api/users/1/tracks",
            upload_gpxfile: "/api/users/1/gpxfiles",
        },
        username: "User #1",
    },
    {
        id: 2,
        links: {
            gpxfiles: "/api/users/2/gpxfiles",
            tracks: "/api/users/2/tracks",
            upload_gpxfile: "/api/users/2/gpxfiles",
        },
        username: "User #2",
    },
];

export function sampleUsers() {
    return users;
}

export function sampleUser(id) {
    if (Number.isInteger(id)) {
        return users.find((u) => u.id === id);
    } else {
        return undefined;
    }
}
