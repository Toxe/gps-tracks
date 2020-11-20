import React from "react";
import "../../../../../i18n-tests";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from ".";

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

        test('When clicking on "Clear search" button, search field should be empty', async () => {
            const { findByTitle, findByPlaceholderText } = render(<Search searchText="search text" />);

            userEvent.click(await findByTitle("Clear search"));

            expect(await findByPlaceholderText("Search…")).toHaveValue("");
        });
    });
});
