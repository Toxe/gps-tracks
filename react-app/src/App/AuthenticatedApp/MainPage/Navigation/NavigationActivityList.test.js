import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavigationActivityList from "./NavigationActivityList";

jest.mock("../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("NavigationActivityList", () => {
    describe("With available activities", () => {
        test("When clicking on a list item, should call handleNavigationClick", async () => {
            const countedActivities = new Map([
                [0, 2],
                [1, 3],
            ]);
            const handleNavigationClick = jest.fn();

            const { findByRole } = render(
                <NavigationActivityList
                    countedActivities={countedActivities}
                    handleNavigationClick={handleNavigationClick}
                />
            );

            userEvent.click(await findByRole("button", { name: "3" }));

            expect(handleNavigationClick).toHaveBeenCalled();
        });
    });
});
