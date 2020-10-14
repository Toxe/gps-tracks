import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { Users } from ".";
import { sampleUser, sampleTracks } from "../../../test";

jest.mock("axios");

describe("Users API", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("Query user data", () => {
        test("When called with valid user id, return user data", async () => {
            axiosMock.get.mockResolvedValueOnce({ status: 200, data: sampleUser(1) });

            const user = await Users.get(1);

            expect(axiosMock.get).toHaveBeenCalledWith("/api/users/1");
            expect(user).toBeObject();
            expect(user.id).toBe(1);
            expect(user.links).toBeObject();
        });

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Users.get(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });

    describe("Query user tracks", () => {
        test("When called with valid user object, return user tracks", async () => {
            axiosMock.get.mockResolvedValueOnce({ status: 200, data: sampleTracks() });
            const user = sampleUser(1);

            const tracks = await Users.tracks(user);

            expect(axiosMock.get).toHaveBeenCalledWith(user.links.tracks);
            expect(tracks).toBeArray();
            expect(tracks).toHaveLength(5);
        });

        test("When called with invalid arguments, reject and return TypeError", async () => {
            expect.assertions(1);
            await expect(Users.tracks(null)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });
});
