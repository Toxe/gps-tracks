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

            expect(user).toBeObject();
            expect(user.id).toBe(1);
            expect(user.links).toBeObject();
        });
    });

    describe("Query user tracks", () => {
        test("When called with valid user object, return user tracks", async () => {
            axiosMock.get.mockResolvedValueOnce({ status: 200, data: sampleTracks() });

            const tracks = await Users.tracks(sampleUser(1));

            expect(tracks).toBeArray();
            expect(tracks).toHaveLength(5);
        });
    });
});
