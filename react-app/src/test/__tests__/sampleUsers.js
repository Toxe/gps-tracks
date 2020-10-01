import "jest-extended";
import "expect-more-jest";
import { sampleUsers, sampleUser } from "../sampleUsers";

describe("sampleUsers()", () => {
    it("Returns list of user objects", () => {
        const users = sampleUsers();

        expect(users).toBeArray();
        expect(users).not.toBeEmptyArray();
    });
});

describe("sampleUser()", () => {
    test("When called with id of existing user, return user object", () => {
        const user = sampleUser(1);

        expect(user).toBeObject();
        expect(user.id).toBe(1);
    });

    test("When called with id of non-existing user, return null", () => {
        expect(sampleUser(99)).toBeNull();
    });

    test("When called with null, return null", () => {
        expect(sampleUser(null)).toBeNull();
    });

    test("When called with undefined, return null", () => {
        expect(sampleUser(undefined)).toBeNull();
    });

    test("When called with a non-numeric id, return null", () => {
        expect(sampleUser("1")).toBeNull();
    });
});
