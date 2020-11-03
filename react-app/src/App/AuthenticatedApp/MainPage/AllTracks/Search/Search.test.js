import React from "react";
import "../../../../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { Search } from ".";

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("Search", () => {
    describe("With search field", () => {
        test("When passing an initial search text, should show search field with search text", async () => {
            const { getByDisplayValue } = render(
                <Search searchText="search text" handleUpdateSearchText={jest.fn()} />
            );

            getByDisplayValue("search text");
        });

        test("When typing in search text, should call handleUpdateSearchText", async () => {
            const handleUpdateSearchText = jest.fn();

            const { findByPlaceholderText } = render(
                <Search searchText="" handleUpdateSearchText={handleUpdateSearchText} />
            );

            userEvent.type(await findByPlaceholderText("Search…"), "search text");

            await waitFor(() => expect(handleUpdateSearchText).toHaveBeenCalledWith("search text"));
        });
    });
});
