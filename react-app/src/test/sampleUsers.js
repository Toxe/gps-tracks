const users = [
    {
        id: 1,
        links: {
            gpxfiles: "/api/users/1/gpxfiles",
            tracks: "/api/users/1/tracks",
        },
        username: "User #1",
    },
    {
        id: 2,
        links: {
            gpxfiles: "/api/users/2/gpxfiles",
            tracks: "/api/users/2/tracks",
        },
        username: "User #2",
    },
];

export function sampleUsers() {
    return users;
}

export function sampleUser(id) {
    if (Number.isInteger(id)) {
        const user = users.find((u) => u.id === id);
        return user ? user : null;
    } else {
        return null;
    }
}
