import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { GPXFiles } from ".";
import { sampleGPXFile, sampleUser } from "../../../test";

jest.mock("axios");

describe("GPXFiles API", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
    });

    describe("Upload GPX file", () => {
        test("When upload successful, should return response data", async () => {
            axiosMock.post.mockResolvedValueOnce({ status: 201, data: sampleGPXFile(21) });

            const user = sampleUser(1);
            const file = new File(["content"], "test.gpx", { type: "application/gpx+xml" });

            const response = await GPXFiles.upload(user, file);

            expect(response.data).toBeObject();
            expect(response.data.id).toBe(21);
        });

        test("When user is null, reject and return TypeError", async () => {
            const user = null;
            const file = new File(["content"], "test.gpx", { type: "application/gpx+xml" });

            expect.assertions(1);
            await expect(GPXFiles.upload(user, file)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When user is undefined, reject and return TypeError", async () => {
            const user = undefined;
            const file = new File(["content"], "test.gpx", { type: "application/gpx+xml" });

            expect.assertions(1);
            await expect(GPXFiles.upload(user, file)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When file is null, reject and return TypeError", async () => {
            const user = sampleUser(1);
            const file = null;

            expect.assertions(1);
            await expect(GPXFiles.upload(user, file)).rejects.toEqual(new TypeError("invalid arguments"));
        });

        test("When file is undefined, reject and return TypeError", async () => {
            const user = sampleUser(1);
            const file = undefined;

            expect.assertions(1);
            await expect(GPXFiles.upload(user, file)).rejects.toEqual(new TypeError("invalid arguments"));
        });
    });
});
