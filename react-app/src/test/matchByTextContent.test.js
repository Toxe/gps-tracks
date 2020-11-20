import React from "react";
import { render } from "@testing-library/react";
import { matchByTextContent } from "./matchByTextContent";

describe("matchByTextContent()", () => {
    test('When called on "some <strong>bold</strong> text", find "some bold text"', async () => {
        const { getByText } = render(
            <div>
                some <strong>bold</strong> text
            </div>
        );

        getByText(matchByTextContent("some bold text"));
    });

    test("When called on nested nodes, find only the node that has no matching children", async () => {
        const { getByText } = render(
            <div id="high">
                <div id="mid">
                    <div id="low">
                        search <em>for</em> <strong>me</strong>
                    </div>
                </div>
            </div>
        );

        const div = getByText(matchByTextContent("search for me"));
        expect(div.id).toBe("low");
    });
});
