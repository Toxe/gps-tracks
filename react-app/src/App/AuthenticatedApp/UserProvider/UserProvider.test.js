import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleUser } from "../../../test";
import { useAuth } from "../../../Auth";
import { Users } from "../api";
import { UserProvider, useUser } from ".";

jest.mock("../../../Auth");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("useUser()", () => {
    describe("Default values", () => {
        test('"user" should default to null', () => {
            useAuth.mockReturnValue({ authId: null });

            const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
            const { result } = renderHook(() => useUser(), { wrapper });

            expect(result.current.user).toBeNull();
        });
    });

    describe("Basic setup", () => {
        test("When calling useUser() outside of a UserProvider, throw error", () => {
            const { result } = renderHook(() => useUser());
            expect(result.error).toEqual(new Error("useUser must be used within a UserProvider"));
        });
    });

    describe("With authenticated user", () => {
        test('When authId is 1, "user" should be an object containing the data of sample user 1', async () => {
            const user = sampleUser(1);

            useAuth.mockReturnValue({ authId: 1 });
            const usersGetSpy = jest.spyOn(Users, "get").mockReturnValueOnce(user);

            const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
            const { result, waitForNextUpdate } = renderHook(() => useUser(), { wrapper });

            await waitForNextUpdate();

            expect(usersGetSpy).toHaveBeenCalledWith(1);
            expect(result.current.user).toBeObject();
            expect(result.current.user).toEqual(user);
        });
    });
});
