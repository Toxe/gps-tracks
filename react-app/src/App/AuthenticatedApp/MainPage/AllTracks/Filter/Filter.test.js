import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filter } from ".";

function renderFilter(activityFilter, yearFilter) {
    const availableActivities = ["0", "1"];
    const availableYears = ["2018", "2019", "2020"];
    const handleChangeActivityFilter = jest.fn();
    const handleChangeYearFilter = jest.fn();

    return {
        ...render(
            <Filter
                activityFilter={activityFilter}
                yearFilter={yearFilter}
                availableActivities={availableActivities}
                availableYears={availableYears}
                handleChangeActivityFilter={handleChangeActivityFilter}
                handleChangeYearFilter={handleChangeYearFilter}
            />
        ),
        handleChangeActivityFilter,
        handleChangeYearFilter,
    };
}

describe("Filter", () => {
    describe("With no specific filter settings", () => {
        test('When available activities are "0" and "1", should show filter menu with 2 activities', async () => {
            const { getByLabelText, findByRole } = renderFilter("", "");

            userEvent.click(getByLabelText("Activity"));

            await findByRole("option", { name: "All" });
            await findByRole("option", { name: "Bike" });
            await findByRole("option", { name: "Hiking" });
        });

        test('When available years are "2018", "2019" and "2020", should show filter menu with 3 years', async () => {
            const { getByLabelText, findByRole } = renderFilter("", "");

            userEvent.click(getByLabelText("Year"));

            await findByRole("option", { name: "All" });
            await findByRole("option", { name: "2018" });
            await findByRole("option", { name: "2019" });
            await findByRole("option", { name: "2020" });
        });
    });

    describe("With selected activity filter option", () => {
        test('When activity filter is "0", selected option should be "Bike"', async () => {
            const { getByLabelText } = renderFilter("0", "");

            getByLabelText("Activity");
            getByLabelText("Bike");
        });

        test('When activity filter is "all", selected option should be "All"', async () => {
            const { getByLabelText } = renderFilter("all", "");

            getByLabelText("Activity");
            getByLabelText("All");
        });
    });

    describe("With selected year filter option", () => {
        test('When year filter is "2019", selected option should be "2019"', async () => {
            const { getByLabelText } = renderFilter("", "2019");

            getByLabelText("Year");
            getByLabelText("2019");
        });

        test('When year filter is "all", selected option should be "All"', async () => {
            const { getByLabelText } = renderFilter("", "all");

            getByLabelText("Year");
            getByLabelText("All");
        });
    });

    describe("Selecting a filter option", () => {
        test("When selecting a different activity, should call handleChangeActivityFilter", async () => {
            const { getByLabelText, findByRole, handleChangeActivityFilter } = renderFilter("", "");

            userEvent.click(getByLabelText("Activity"));
            userEvent.click(await findByRole("option", { name: "Bike" }));

            expect(handleChangeActivityFilter).toHaveBeenCalled();
        });

        test("When selecting a different year, should call handleChangeYearFilter", async () => {
            const { getByLabelText, findByRole, handleChangeYearFilter } = renderFilter("", "");

            userEvent.click(getByLabelText("Year"));
            userEvent.click(await findByRole("option", { name: "2020" }));

            expect(handleChangeYearFilter).toHaveBeenCalled();
        });
    });
});
